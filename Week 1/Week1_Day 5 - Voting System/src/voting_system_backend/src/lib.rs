use candid::{CandidType, Deserialize};
use std::cell::RefCell;

#[derive(CandidType, Deserialize, Clone)]
struct Candidate {
    name: String,
    party: String,
    votes: u32,
}

thread_local! {
    static CANDIDATES: RefCell<Vec<Candidate>> = RefCell::new(vec![
        Candidate { name: "Narendra Modi".to_string(), party: "BJP".to_string(), votes: 0 },
        Candidate { name: "Rahul Gandhi".to_string(), party: "INC".to_string(), votes: 0 },
        Candidate { name: "Arvind Kejriwal".to_string(), party: "AAP".to_string(), votes: 0 },
        Candidate { name: "Mamata Banerjee".to_string(), party: "TMC".to_string(), votes: 0 },
        Candidate { name: "Akhilesh Yadav".to_string(), party: "SP".to_string(), votes: 0 },
        Candidate { name: "Mayawati".to_string(), party: "BSP".to_string(), votes: 0 },
    ]);
}

#[ic_cdk::update]
fn vote(candidate_index: u32) -> String {
    CANDIDATES.with(|candidates| {
        let mut candidates = candidates.borrow_mut();
        if let Some(candidate) = candidates.get_mut(candidate_index as usize) {
            candidate.votes += 1;
            return format!("You voted for: {} from {}", candidate.name, candidate.party);
        }
        "Invalid candidate".to_string()
    })
}

#[ic_cdk::query]
fn get_results() -> Vec<Candidate> {
    CANDIDATES.with(|candidates| candidates.borrow().clone())
}
