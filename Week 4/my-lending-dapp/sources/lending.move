module lending::PeerToPeerLending {

    use std::signer;
    use std::debug;
    use std::string;
    use aptos_framework::coin;
    use aptos_framework::aptos_coin::AptosCoin;

    enum Role has copy, drop, store {
        Borrower,
        Lender
    }

    struct UserRole has key {
        role: Role
    }

    struct UserBalance has key {
        balance: coin::Coin<AptosCoin>
    }

    public entry fun register_user(account: &signer, is_lender: bool) {
        let addr = signer::address_of(account);
        assert!(!exists<UserRole>(addr), 100);
        let role: Role;
        if (is_lender) {
            role = Role::Lender;
        } else {
            role = Role::Borrower;
        };
        let user_role = UserRole { role };
        move_to(account, user_role);
        let zero = coin::zero<AptosCoin>();
        let user_balance = UserBalance { balance: zero };
        move_to(account, user_balance);
    }

    public entry fun add_funds(account: &signer, amount: u64) acquires UserBalance, UserRole {
        let addr = signer::address_of(account);
        assert_user_is_lender(account);
        let coins = coin::withdraw<AptosCoin>(account, amount);
        let user_balance = borrow_global_mut<UserBalance>(addr);
        coin::merge(&mut user_balance.balance, coins);
    }

    #[view]
    public fun get_user_balance(addr: address): u64 acquires UserBalance {
        let balance_ref = borrow_global<UserBalance>(addr);
        coin::value(&balance_ref.balance)
    }
    

    public entry fun borrow_from_lender(
        borrower: &signer,
        lender_addr: address,
        amount: u64
    ) acquires UserBalance, UserRole {
        assert_user_is_borrower(borrower);
        // Verify lender's role
        assert!(borrow_global<UserRole>(lender_addr).role == Role::Lender, 103);
        let borrower_addr = signer::address_of(borrower);

        // Check lender's balance sufficiency
        let lender_balance = borrow_global<UserBalance>(lender_addr);
        assert!(coin::value(&lender_balance.balance) >= amount, 104);

        let taken = {
            let lender_balance = borrow_global_mut<UserBalance>(lender_addr);
            coin::extract(&mut lender_balance.balance, amount)
        };

        let borrower_balance = borrow_global_mut<UserBalance>(borrower_addr);
        coin::merge(&mut borrower_balance.balance, taken);

        // Debug prints (example improvement)
        debug::print(&string::utf8(b"Lender Balance After:"));
        debug::print(&coin::value(&borrow_global<UserBalance>(lender_addr).balance));
        debug::print(&string::utf8(b"Borrower Balance After:"));
        debug::print(&coin::value(&borrow_global<UserBalance>(borrower_addr).balance));
    }

    fun assert_user_is_lender(account: &signer) acquires UserRole {
        let role_data = borrow_global<UserRole>(signer::address_of(account));
        assert!(role_data.role == Role::Lender, 101);
    }

    fun assert_user_is_borrower(account: &signer) acquires UserRole {
        let role_data = borrow_global<UserRole>(signer::address_of(account));
        assert!(role_data.role == Role::Borrower, 102);
    }
}