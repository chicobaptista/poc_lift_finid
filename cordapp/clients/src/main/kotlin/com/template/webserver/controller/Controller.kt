package com.template.webserver.controllers

import com.template.flow.CreateAccount
import com.template.model.AccountModel
import com.template.schema.AccountSchemaV1
import com.template.state.AccountState
import com.template.webserver.NodeRPCConnection
import net.corda.core.messaging.startTrackedFlow
import net.corda.core.messaging.vaultQueryBy
import net.corda.core.node.services.vault.Builder.equal
import net.corda.core.node.services.vault.QueryCriteria
import net.corda.core.utilities.getOrThrow
import org.slf4j.LoggerFactory
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

    @GetMapping(value = "/templateendpoint", produces = arrayOf("text/plain"))
    private fun templateendpoint(): String {
        return "Define an endpoint here."
    }

    @CrossOrigin
    @PostMapping(value = "/create-account", produces = arrayOf(MediaType.APPLICATION_JSON), consumes = arrayOf(MediaType.APPLICATION_JSON))
    fun createDebit(@RequestBody data: AccountModel): Response {

        val indexUid = AccountSchemaV1.PersistentAccount::uid.equal(data.uid)
        val criteria = QueryCriteria.VaultCustomQueryCriteria(expression = indexUid)
        val states = proxy.vaultQueryBy<AccountState>(criteria).states

        if (states.isNotEmpty()){
            return Response.status(Response.Status.BAD_REQUEST).entity("UID já existe nesta Org.\n").build()
        }

        if (data.balance < 0 ) {
            return Response.status(Response.Status.BAD_REQUEST).entity("Valor não deve ser negativo.\n").build()
        }

        return try {

            val signedTx = proxy.startTrackedFlow(CreateAccount::CreateAccountFlow, data.uid, data.pubkey, data.currency, data.hashProfile, data.message, data.signature).returnValue.getOrThrow()

            Response.status(Response.Status.CREATED).entity( signedTx.tx.outputs.single() ).build()

        } catch (ex: Throwable) {
            logger.error(ex.message, ex)
            logger.error(ex.toString())
            Response.status(Response.Status.BAD_REQUEST).entity(ex.message).build()
        }
    }

}