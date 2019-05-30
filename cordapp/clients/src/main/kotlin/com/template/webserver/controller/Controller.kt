package com.template.webserver.controllers

import com.template.flow.CreateAccount
import com.template.flow.CreateTransfer
import com.template.model.AccountRequestModel
import com.template.model.TransferRequestModel
import com.template.schema.AccountSchemaV1
import com.template.state.AccountState
import com.template.state.TransferState
import com.template.webserver.NodeRPCConnection

import net.corda.core.messaging.startTrackedFlow
import net.corda.core.messaging.vaultQueryBy
import net.corda.core.node.services.Vault
import net.corda.core.node.services.vault.Builder.equal
import net.corda.core.node.services.vault.QueryCriteria
import net.corda.core.utilities.getOrThrow
import org.slf4j.LoggerFactory

import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.*

import javax.ws.rs.core.MediaType
import javax.ws.rs.core.Response

/**
 * Define your API endpoints here.
 */
@RestController
@RequestMapping("/") // The paths for HTTP requests are relative to this base path.
class Controller(rpc: NodeRPCConnection) {

    companion object {
        private val logger = LoggerFactory.getLogger(RestController::class.java)
    }

    private val proxy = rpc.proxy

    @GetMapping(value = ["/templateendpoint"], produces = arrayOf("text/plain"))
    private fun templateendpoint(): String {
        return "Define an endpoint here."
    }

    @CrossOrigin
    @PostMapping(value = ["/create-account"], produces = arrayOf(MediaType.APPLICATION_JSON), consumes = arrayOf(MediaType.APPLICATION_JSON))
    fun createAccount(@RequestBody data: AccountRequestModel): Response {

        val indexUid = AccountSchemaV1.PersistentAccount::uid.equal(data.uid)
        val criteria = QueryCriteria.VaultCustomQueryCriteria(expression = indexUid)
        val account = proxy.vaultQueryBy<AccountState>(criteria).states

        val indexDid = AccountSchemaV1.PersistentAccount::did.equal(data.did)
        val criteriaB = QueryCriteria.VaultCustomQueryCriteria(expression = indexDid)
        val did = proxy.vaultQueryBy<AccountState>(criteriaB).states


        if (account.isNotEmpty()){
            return Response.status(Response.Status.BAD_REQUEST).entity("UID já existe nesta Org.\n").build()
        }

        if (did.isNotEmpty()){
            return Response.status(Response.Status.BAD_REQUEST).entity("DID já existe nesta Org.\n").build()
        }

        if (data.balance < 0 ) {
            return Response.status(Response.Status.BAD_REQUEST).entity("Valor não deve ser negativo.\n").build()
        }

        return try {

            val signedTx = proxy.startTrackedFlow(CreateAccount::CreateAccountFlow, data.uid, data.name, data.did, data.balance).returnValue.getOrThrow()

            Response.status(Response.Status.CREATED).entity( signedTx.tx.outputs.single() ).build()

        } catch (ex: Throwable) {
            logger.error(ex.message, ex)
            logger.error(ex.toString())
            Response.status(Response.Status.BAD_REQUEST).entity(ex.message).build()
        }
    }


    @CrossOrigin
    @PostMapping(value = ["/make-transfer"], produces = arrayOf(MediaType.APPLICATION_JSON), consumes = arrayOf(MediaType.APPLICATION_JSON))
    fun transfer(@RequestBody transfer: TransferRequestModel): Response {

            if (transfer.amount <= 0 ) {
                return Response.status(Response.Status.BAD_REQUEST).entity("Valor deve ser positivo\n").build()
            }

            return try {

                val matchingParties = proxy.partiesFromName(transfer.orgTo, false)
                if (matchingParties.isEmpty()) {
                    return Response.status(Response.Status.BAD_REQUEST).entity("OrgTo não encontrado\n").build()
                } else if (matchingParties.size > 1) {
                    return Response.status(Response.Status.BAD_REQUEST).entity("OrgTo em formato inválido.\n").build()
                }
                val orgToParty = matchingParties.single()

                val signedTx = proxy.startTrackedFlow(CreateTransfer::TransferFlow,
                        transfer.accountFromId ,orgToParty, transfer.to, transfer.amount, transfer.did).returnValue.getOrThrow()
                Response.status(Response.Status.CREATED).entity( signedTx.tx.outputs ).build()

            } catch (ex: Throwable) {

                logger.error(ex.message, ex)
                Response.status(Response.Status.BAD_REQUEST).entity(ex.message).build()

            }
        }

    @GetMapping(value = ["/balance/{uid}"], produces = arrayOf(MediaType.APPLICATION_JSON))
    private fun getBalanceById(@PathVariable uid: String) : Response {

        val indexUid = AccountSchemaV1.PersistentAccount::uid.equal(uid)
        val criteria = QueryCriteria.VaultCustomQueryCriteria(expression = indexUid)

        val states = proxy.vaultQueryBy<AccountState>(criteria).states

        return if (states.isNotEmpty()){

            Response.status(Response.Status.CREATED).entity(states).build()

        } else {

            Response.status(Response.Status.NOT_FOUND).entity("Balance not found").build()
        }

    }

    @GetMapping(value = ["/transfer/{uid}"], produces = arrayOf(MediaType.APPLICATION_JSON))
    private fun getTransferById(@PathVariable uid: String) : Response {

        val indexUid = AccountSchemaV1.PersistentAccount::uid.equal(uid)
        val criteria = QueryCriteria.VaultCustomQueryCriteria(expression = indexUid)

        val states = proxy.vaultQueryBy<TransferState>(criteria).states

        return if (states.isNotEmpty()){

            Response.status(Response.Status.CREATED).entity(states).build()

        } else {

            Response.status(Response.Status.NOT_FOUND).entity("Balance not found").build()
        }

    }


}