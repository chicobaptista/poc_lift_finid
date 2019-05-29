package com.template.flows

import com.template.flow.BaseFlow
import net.corda.core.transactions.SignedTransaction

abstract class BaseSubFlow : BaseFlow() {

    abstract fun callSubFlow(): SignedTransaction
}