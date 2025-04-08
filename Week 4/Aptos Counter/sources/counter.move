module 0xe12fa0c00b70050db6cccfb3be5f086e81ae1eb206c3fed7063f819ea02e1475::counter {
    use std::signer;

    struct Counter has key {
        value: u64,
    }

    public fun initialize(account: &signer) {
        move_to(account, Counter { value: 0 });
    }

    public fun increment(account: &signer) acquires Counter {
        let counter = borrow_global_mut<Counter>(signer::address_of(account));
        counter.value = counter.value + 1;
    }

    public fun get(account: address): u64 acquires Counter {
        borrow_global<Counter>(account).value
    }
}
