package com.template.model

import net.corda.core.identity.Party
import net.corda.core.serialization.CordaSerializable
import java.time.Instant

@CordaSerializable
data class AccountModel(
    val entity : Party,
    val entityName : String,
    val createTime : Instant,
    val name : String,
    val uid : String,
    val pubkey : String,
    val message: String,
    val signature: String,
    val currency : String,
    val balance : Double,
    val status : StatusEnum
)

@CordaSerializable
enum class StatusEnum {
    CREATED, VALIDATED
}