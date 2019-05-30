package com.template.model

data class TransferRequestModel (
        val accountFromId: String,
        val orgTo: String,
        val to: String,
        val amount: Double,
        val did: String
)