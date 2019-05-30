package com.template.contract

import com.template.state.TransferState
import net.corda.core.contracts.CommandData
import net.corda.core.contracts.Contract
import net.corda.core.contracts.requireThat
import net.corda.core.transactions.LedgerTransaction

import net.corda.core.crypto.Crypto
import org.bouncycastle.util.encoders.Hex
import java.security.PublicKey
import java.util.*


class TransferContract : Contract {

    /*
    companion object {
        @JvmStatic
        val ACCOUNT_CONTRACT_ID = "com.rtm.poc.contract.TransferContract"
    }
    */

    override fun verify(tx: LedgerTransaction) {

        val command = tx.commandsOfType<Commands>().single()

        when (command.value) {
            is Commands.CreateTransfer -> verifyCreateTransfer(tx)
            is Commands.FinalisingTransfer -> verifyFinalisingTransfer(tx)
            else -> throw IllegalArgumentException("Command not found")
        }

    }

    // validação para criar uma nova transferência
    private fun verifyCreateTransfer(tx: LedgerTransaction){

        requireThat {

            val out = tx.outputsOfType<TransferState>().single()
//            val imp = tx.inputsOfType<TransferState>().single()
//            "Balance do output maior que o do imput" using (imp. .balance > out.transfer.balance)
//            "Valor deve ser positivo" using (out.transfer.balance > 0.00 || out.transfer.balance == 0.00)
            "Para transferência deve haver apenas uma conta de origem" using (tx.inputs.size == 1)
            "A transferência deve gerar uma nova conta e uma transferência" using (tx.outputs.size == 2)
            "Valor deve ser positivo" using (out.transfer.amount > 0.00)
            "Remetente e destinatário devem ser diferentes" using (out.transfer.accountFrom != out.transfer.accountTo || out.transfer.orgFrom != out.transfer.orgTo)

//            val pubKey = getKey(out.transfer.pubkey.toByteArray())
//            val signature = Hex.decode(out.transfer.signature)
//            val b = Crypto.doVerify(Crypto.RSA_SHA256, pubKey, signature , out.transfer.message.toByteArray())
//            "Signature verification failed" using(b)
        }

    }

    // validação para consluir a transferência, creditar a conta de destino
    private fun verifyFinalisingTransfer(tx: LedgerTransaction){

        requireThat {
            "Para consumir uma transferência haver uma conta de origem e a transferência" using (tx.inputs.size == 2)
            "Para consumir uma transferência deve haver apenas uma nova conta de destino" using (tx.outputs.size == 1)
        }

    }

    // decodificação da chave publica RSA
    private fun getKey(publicKey: ByteArray): PublicKey {
        val publicBytes =  Base64.getDecoder().decode(publicKey)
        return Crypto.decodePublicKey(Crypto.RSA_SHA256, publicBytes)
    }

    interface Commands : CommandData {
        class CreateTransfer : Commands
        class FinalisingTransfer : Commands
    }

}