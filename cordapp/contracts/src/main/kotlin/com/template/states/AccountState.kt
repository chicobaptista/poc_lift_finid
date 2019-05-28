package com.template.state

import com.template.contract.AccountContract
import com.template.model.AccountModel
import com.template.schema.AccountSchemaV1
import net.corda.core.contracts.BelongsToContract
import net.corda.core.contracts.LinearState
import net.corda.core.contracts.UniqueIdentifier
import net.corda.core.identity.AbstractParty
import net.corda.core.schemas.MappedSchema
import net.corda.core.schemas.PersistentState
import net.corda.core.schemas.QueryableState

@BelongsToContract(AccountContract::class)
data class AccountState(val account: AccountModel,
                      override val linearId: UniqueIdentifier = UniqueIdentifier()
) : LinearState, QueryableState {

    override val participants: List<AbstractParty> = listOf(account.entity)

    override fun generateMappedObject(schema: MappedSchema): PersistentState {

        return when (schema) {
            is AccountSchemaV1 -> AccountSchemaV1.PersistentAccount(
                    this.account.uid,
                    this.account.status
            )
            else -> throw IllegalArgumentException("Unrecognised schema $schema")
        }

    }

    override fun supportedSchemas(): Iterable<MappedSchema> {
        return listOf(AccountSchemaV1)
    }

}