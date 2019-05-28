package com.template.flow

import co.paralleluniverse.fibers.Suspendable
import com.template.contract.AccountContract
import net.corda.core.contracts.Command
import net.corda.core.flows.*
import net.corda.core.transactions.SignedTransaction
import net.corda.core.transactions.TransactionBuilder
import net.corda.core.utilities.ProgressTracker
import com.template.model.AccountModel
import com.template.model.StatusEnum
import com.template.state.AccountState
import java.time.Instant

object CreateAccount {

    @InitiatingFlow
    @StartableByRPC
    class CreateAccountFlow(
            val uid : String,
            val name: String,
            val pubkey : String,
            val message: String,
            val signature: String,
            val currency : String,
            val balance : Double,
            val status : StatusEnum
    ) : BaseFlow() {

        companion object {

            object INITIALISING : ProgressTracker.Step("Inicializando")
            object BUILDING : ProgressTracker.Step("Construindo")
            object SIGNING : ProgressTracker.Step("Assinando")

            object FINALISING : ProgressTracker.Step("Finalizando") {
                override fun childProgressTracker() = FinalityFlow.tracker()
            }

            fun tracker() = ProgressTracker(
                INITIALISING,
                BUILDING,
                SIGNING,
                FINALISING
            )
        }

        override val progressTracker = tracker()

        /**
         * The flow logic is encapsulated within the call() method.
         */
        @Suspendable
        override fun call(): SignedTransaction {

            // define progresso
            progressTracker.currentStep = INITIALISING

            val accountList = getAccountStateByDocument(this.uid)
            if (accountList.isNotEmpty()) {
                throw Exception("Conta existente")
            }

            // define uma conta
            val account = AccountModel(
                    entity = ourIdentity,
                    entityName = ourIdentity.name.organisation,
                    createTime = Instant.now(),
                    name = name,
                    uid = uid,
                    pubkey = pubkey,
                    message = message,
                    signature = signature,
                    currency = currency,
                    balance = balance,
                    status = status)

            // cria o state
            val accountState = AccountState(account)

            // criando o command para validação do contract
            val txCommand = Command(
                AccountContract.Commands.CreateAccount(),
                accountState.participants.map { it.owningKey }
            )

            progressTracker.currentStep = BUILDING

            // criando a transação e validando
            val txBuilder = TransactionBuilder(notary)
                .addCommand(txCommand)
                .addOutputState(accountState, AccountContract::class.java.canonicalName)

            txBuilder.verify(serviceHub)

            progressTracker.currentStep = SIGNING

            // banco assinando a transação
            val signedTx = serviceHub.signInitialTransaction(txBuilder, ourIdentity.owningKey)

            progressTracker.currentStep = FINALISING

            // finalizando
            return subFlow(
                FinalityFlow(signedTx,
                    FINALISING.childProgressTracker()
                )
            )

        }
    }

}