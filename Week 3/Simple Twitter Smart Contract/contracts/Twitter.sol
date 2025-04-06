// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Twitter {
    struct Tweet {
        uint256 id;
        address user;
        string content;
        uint256 timestamp;
    }

    uint256 private nextTweetId;
    mapping(uint256 => Tweet) public tweets;
    mapping(address => uint256[]) public userTweets;

    event TweetPosted(uint256 id, address indexed user, string content, uint256 timestamp);

    function postTweet(string memory _content) public {
        require(bytes(_content).length > 0, "Tweet content cannot be empty");
        require(bytes(_content).length <= 280, "Tweet content exceeds 280 characters");

        tweets[nextTweetId] = Tweet(nextTweetId, msg.sender, _content, block.timestamp);
        userTweets[msg.sender].push(nextTweetId);

        emit TweetPosted(nextTweetId, msg.sender, _content, block.timestamp);
        nextTweetId++;
    }

    function getTweet(uint256 _id) public view returns (Tweet memory) {
        require(_id < nextTweetId, "Tweet does not exist");
        return tweets[_id];
    }

    function getUserTweets(address _user) public view returns (uint256[] memory) {
        return userTweets[_user];
    }
}
