module Refund::Refund {
    use std::signer;

    struct RefundData has key {
        amount: u64,
    }

   
    public entry fun store_refund_data(account: &signer, amount: u64) {
        move_to(account, RefundData { amount });
    }

    
    public entry fun delete_refund_data(account: &signer) acquires RefundData {
        let addr = signer::address_of(account);
        let RefundData { amount: _ } = move_from<RefundData>(addr);
    }
}