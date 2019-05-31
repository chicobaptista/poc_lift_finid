package com.template.webserver.controllers

import com.beust.klaxon.Json
import com.beust.klaxon.Klaxon
import com.template.state.AccountState
import com.template.webserver.NodeRPCConnection
import org.slf4j.LoggerFactory
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.bind.annotation.*
import java.time.LocalDateTime
import java.time.ZoneId

import javax.ws.rs.core.MediaType.APPLICATION_JSON

//import reactor.core.publisher.Flux

/**
 * Define your API endpoints here.
 */
@RestController
@RequestMapping("/api") // The paths for GET and POST requests are relative to this base path.
class StandardController(private val rpc: NodeRPCConnection) {


    companion object {
        private val logger = LoggerFactory.getLogger(RestController::class.java)

    }

    init {
        // Define a Vault observable for the Example State
        val exampleStateVaultObservable = rpc.proxy.vaultTrack(AccountState::class.java).updates
        exampleStateVaultObservable.subscribe { update ->
            update.produced.forEach { (state) ->
                logger.info("Vault update :" + state.data)
            }
        }
    }

    private val myLegalName = rpc.proxy.nodeInfo().legalIdentities.first().name


    private val proxy = rpc.proxy

    @CrossOrigin
    @GetMapping(value = ["me"], produces = arrayOf(APPLICATION_JSON))
    fun whoami() = mapOf("me" to myLegalName)

    @CrossOrigin
    @GetMapping(value = ["/status"], produces = arrayOf("text/plain"))
    private fun status() = "200"

    @CrossOrigin
    @GetMapping(value = ["/servertime"], produces = arrayOf("text/plain"))
    private fun serverTime() = LocalDateTime.ofInstant(proxy.currentNodeTime(), ZoneId.of("UTC")).toString()

    @CrossOrigin
    @GetMapping(value = ["/addresses"], produces = arrayOf("text/plain"))
    private fun addresses() = proxy.nodeInfo().addresses.toString()

    @CrossOrigin
    @GetMapping(value = ["/identities"], produces = arrayOf("text/plain"))
    private fun identities() = proxy.nodeInfo().legalIdentities.toString()

    @CrossOrigin
    @GetMapping(value = ["/platformversion"], produces = arrayOf("text/plain"))
    private fun platformVersion() = proxy.nodeInfo().platformVersion.toString()

    @CrossOrigin
    @GetMapping(value = ["/peers"], produces = arrayOf("text/plain"))
    private fun peers() = proxy.networkMapSnapshot().flatMap { it.legalIdentities }.toString()

    @CrossOrigin
    @GetMapping(value = ["/notaries"], produces = arrayOf("text/plain"))
    private fun notaries() = proxy.notaryIdentities().toString()

    @CrossOrigin
    @GetMapping(value = ["/flows"], produces = arrayOf("text/plain"))
    private fun flows() = proxy.registeredFlows().toString()

//    @GetMapping(value = ["/numbers"], produces = arrayOf(APPLICATION_STREAM_JSON_VALUE))
//    @ResponseBody
//    fun getNumbers() = Flux.range(1, 100)

    @CrossOrigin
    @GetMapping(value = ["/verifyDid/{did}"], produces = arrayOf("text/plain"))
    private fun verifyDid(@PathVariable did: String): String {

        val str = Did(did = did, result = true)

        // val did = { "did": $did, "result": true}
        return Klaxon().toJsonString(str)
    }

    class Did(
            @Json(name = "did")
            val did: String,
            @Json(name = "result")
            val result: Boolean)

}