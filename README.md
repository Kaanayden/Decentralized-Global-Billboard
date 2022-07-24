# Decentralized-Global-Billboard

##How Decentralized Global Billboard website works?

There are 5 section on our website:
  There are a wallet connection button to connect users metamask wallet with our smart contract.
    
Buy Ad page:
    Date and time selection parts allow user to pick the exact time of the ad which user's want to buy or see.
      Now button shows the ad which belong to this moment.
      There are 1440 ad part for each one minutes in the chosen day. Users can click the button which belongs to chosen ad and then they can see or buy the chosen ad if they have enough token at their wallet. To buy an ad users should upload the their ad's image.
 
 Billboards page:
       Total reward in pool : The number of how much token will be distrubited.
       
Mint Tokens page:
       After connecting their wallet to the webiste users can mint 100BBRD to test the system (this section is only for testing).
       
API Propals page:
      This page is not ready to use.

Billboard Report page:
      In this page user can test API's which are registered in the contract and report if any registered domain do not show advertisement and get reward.
     

Contract Interaction Functions:
beBillboardShower( domainName ): for those who want show ads (billboard). user should have billboard ready in his website.
buyAd( time, imageURL ): unix time for each minute and ad image url as parameters. 2 days ago auction starts and price decreases.User buys ad from that with dutch auction system. Price decreases until last auction time(last 10 minutes in that example).
changeAdURI( time, _imageURI): owner can change image url for time which own.
deactivateBillboardShower( _domainName): billboard shower can make deactive when he do not want show billboard.
executeProposal( id ): if api url change proposal have enough votes, it can be executed with that command.
giveVote( id ): give vote to given parameter as index to change api url.
mockMintTokens(): mints 100 BBRD tokens for address.
proposeVoting( Target(uint8), _proposedURL ): propose new URL for traffic fetcher or billboard checkers api.
reportBillboardShower( _domainName ): If a billboard shower do not display billboard ad element, a user can report that domain and get half of reward which belongs to domain owner's.
Also domainName gets banned because not displaying ads while it's active and not deactivated it's status in contract. 
API checks whether report is true by fetching domain URL and checks whether it has ad element in its HTML.
Reward is given as incentive to establish more reporters check websites, so billboard system could work properly.
withdrawReward( domainName): Owner withdraws reward of domain name which displays billboard.

IPFS & Web3.storage used in 
website-final/src/components/Modal/Modal.js

Covalent used in 
website-final/src/pages/Billboards.js
https://github.com/Kaanayden/Decentralized-Global-Billboard/blob/main/website-final/src/scripts/Covalent.js

