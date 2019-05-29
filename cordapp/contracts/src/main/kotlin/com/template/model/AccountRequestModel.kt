package com.template.model.debit

import java.security.Signature

data class CreateRequestModel (
        val uid : String,
        val pubkey : String,
        val currency : String,
        val hashProfile : String,
        val balance : Double,
        val message: String,
        val signature: String
)