package com.template.schema

import net.corda.core.identity.Party
import net.corda.core.schemas.MappedSchema
import net.corda.core.schemas.PersistentState
import java.util.*
import javax.persistence.Column
import javax.persistence.Entity
import javax.persistence.Index
import javax.persistence.Table

/**
 * The family of schemas for AccountState.
 */
object AccountSchema

object AccountSchemaV1 : MappedSchema(
    schemaFamily = AccountSchema.javaClass,
    version = 1,
    mappedTypes = listOf(PersistentAccount::class.java)) {
    @Entity
    @Table(name = "account_states", indexes = [Index(name = "uid_idx", columnList="uid")])
    class PersistentAccount(

        @Column(name = "uid")
        var uid: String,

        @Column(name = "did")
        var did: String

    ) : PersistentState() {
        // Default constructor required by hibernate.
        constructor(): this(uid = "", did = "")
    }
}