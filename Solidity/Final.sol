// SPDX-License-Identifier: MIT


import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";
import '@chainlink/contracts/src/v0.8/ChainlinkClient.sol';
import '@chainlink/contracts/src/v0.8/ConfirmedOwner.sol';


pragma solidity ^0.8.0;
contract DecentralizedGlobalBillboard is ERC20, ERC20Burnable, ERC20Permit, ChainlinkClient, ConfirmedOwner {
    using Chainlink for Chainlink.Request;

    bytes32 private jobId;
    uint256 private fee;


    //requestId to TrafficData
    mapping( bytes32 => TrafficData ) requestIds;

    struct TrafficData {
        Target targetType;
        string domainName;
        address rewardAddress;
    }

    event RequestTraffic(bytes32 indexed requestId, uint256 traffic, string domainName);
    event MadeProposal( Target indexed targetType, string proposedURL, uint index );
    event AdBuy( uint time, string imageURI );
    event NewBillboard( address indexed owner, string domainName );
    event BannedBillboard( address indexed owner, string domainName );

    function requestTrafficData(Target targetType, string memory checkUrl) internal {
        Chainlink.Request memory req = buildChainlinkRequest(jobId, address(this), this.fulfill.selector);
        string memory apiUrl;
        if(targetType == Target.TRAFFIC) {
            apiUrl = TRAFFIC_AND_FIRST_BILLBOARD_CHECKER_API_URL;
        } else {
            apiUrl = BILLBOARD_CHECKER_API_URL;
        }
        string memory checkUrlAPI = string.concat( apiUrl ,checkUrl );
        // Set the URL to perform the GET request on
        req.add('get', checkUrlAPI);
        req.add('path', 'TRAFFIC'); 
        int256 timesAmount = 10**1;
        req.addInt('times', timesAmount);

        // Sends the request
        bytes32 idOfRequest = sendChainlinkRequest(req, fee);

        if(targetType == Target.TRAFFIC) {
            requestIds[ idOfRequest ].targetType = Target.TRAFFIC;
            requestIds[ idOfRequest ].domainName = checkUrl;

        } else {
            requestIds[ idOfRequest ].targetType = Target.BILLBOARD_CHECKER;
            requestIds[ idOfRequest ].domainName = checkUrl;
            requestIds[ idOfRequest ].rewardAddress = msg.sender;
        }
    }
        function fulfill(bytes32 _requestId, uint256 _traffic) public recordChainlinkFulfillment(_requestId) {
            TrafficData memory trafficData = requestIds[ _requestId ];
            string memory _domainName = trafficData.domainName;
            uint _rewardCoefficient = _traffic;
            emit RequestTraffic(_requestId, _traffic, _domainName );
        
            if( trafficData.targetType == Target.TRAFFIC ) {
                if( _rewardCoefficient > 0 ) {
                    uint time = block.timestamp;
                    billboardShowers[ _domainName ].isActive = true;
                    billboardShowers[ _domainName ].rewardCoefficient = _rewardCoefficient;
                    billboardShowersDomainNames.push( _domainName );
                    lastTotalCoefficient = lastTotalCoefficient + (time - lastTotalCoefficientRefreshTime) * currentCoefficientSum;
                    currentCoefficientSum += _rewardCoefficient;
                    lastTotalCoefficientRefreshTime = time;

                    emit NewBillboard( billboardShowers[ _domainName ].ownerAddress, _domainName );
                }
            } else {
                if( _traffic == 0 ) {

                    BillboardShower memory billboardShower = billboardShowers[ _domainName ];
                    uint time = block.timestamp;
                    // pool * user's current coeffiecnt / current total coefficient
                    uint currentAdShowerCoefficient = billboardShower.rewardCoefficient * (time - billboardShower.startTime);
                    uint currentTotalCoefficient = lastTotalCoefficient + (time - lastTotalCoefficientRefreshTime) * currentCoefficientSum;
                    uint reward = billboardShowerPool * currentAdShowerCoefficient / currentTotalCoefficient / COEFFICENT_INCREASE_PERIOD * COEFFICENT_INCREASE_PERIOD;
                    //reporter gets half of the reward as an incentive to reporting and billboard shower not gets reward because not showing billboard and get banned.
                    reward = reward / 2;
                    address reporterAddress = trafficData.rewardAddress;
                    _transfer( address(this),  reporterAddress, reward );
                    billboardShowerPool -= reward;
                    lastTotalCoefficient = currentTotalCoefficient - currentAdShowerCoefficient;
                    lastTotalCoefficientRefreshTime = time;
                    billboardShowers[ _domainName ].startTime = time;


                    billboardShowers[ _domainName ].isActive = false;
                    billboardShowers[ _domainName ].isBanned = true;
                    currentCoefficientSum -= billboardShower.rewardCoefficient;

                    emit BannedBillboard( billboardShower.ownerAddress, _domainName );
                }
            }
    }

//10 million tokens initial
    constructor() ERC20("Billboard", "BBRD") ERC20Permit("Billboard") ConfirmedOwner(msg.sender) {
        _mint(msg.sender, 10000000 * 10 ** decimals());

        setChainlinkToken(0xa36085F69e2889c224210F603D836748e7dC0088);
        setChainlinkOracle(0x74EcC8Bdeb76F2C6760eD2dc8A46ca5e581fA656);
        jobId = 'ca98366cc7314957b8c012c72f05aeeb';
        fee = (1 * LINK_DIVISIBILITY) / 10; // 0,1 * 10**18 (Varies by network and job)
    } 

    uint constant LAST_URI_CHANGE_TIME = 2 minutes;
    uint constant LAST_BID_TIME = 10 minutes;
    uint constant BID_START_TIME = 2 days;
    uint constant DEFAULT_PRICE = 0.01 ether;
    uint constant AD_DURATION = 1 minutes;
    uint constant BURN_RATE = 20; //hundred percent

    

//Billboard showers
    uint constant COEFFICENT_INCREASE_PERIOD = 1 seconds;
    //uint constant COEFFICENT_INCREASE_START_DURATION = 24 hours; //to give time to reporters
    //uint constant MINUS_PER_SHOWER = COEFFICENT_INCREASE_START_DURATION / COEFFICENT_INCREASE_PERIOD;
    //uint public billboardShowerNumber;
    string[] public billboardShowersDomainNames;
    uint public lastTotalCoefficient;
    uint public lastTotalCoefficientRefreshTime;
    uint public currentCoefficientSum;
    uint public billboardShowerPool;

    mapping( string => BillboardShower ) public billboardShowers;

    struct Advertisement {
        string imageURI;
        uint startPrice;
        uint bidAmount;
        uint bidTime;
        address owner;
    }

//IPFS APIs Urls
    string public TRAFFIC_AND_FIRST_BILLBOARD_CHECKER_API_URL = "https://decentralized-billboard.herokuapp.com/getTrafficDataandAdCheck?toCheckUrl=";
    string public BILLBOARD_CHECKER_API_URL = "https://decentralized-billboard.herokuapp.com/adCheck?toCheckUrl=";

    enum Target {
        TRAFFIC,
        BILLBOARD_CHECKER
    }

    Proposal[] public proposals;

    mapping( uint => mapping(address => bool) ) isVoted;

    struct Proposal {
        Target target;
        string proposedURL;
        uint requiredVotes;
        uint acceptingVotes;
        mapping( address => bool ) isVoted;
        bool isDone;
    }

    function proposeVoting( Target _target, string calldata _proposedURL) external {
        Proposal storage proposal = proposals.push();
        proposal.target = _target;
        proposal.proposedURL = _proposedURL;
        proposal.requiredVotes = totalSupply() / 2;

        emit MadeProposal( _target, _proposedURL, proposals.length - 1 );
    }

    function executeProposal( uint id ) external {
        require( proposals[id].requiredVotes > 0, "not active proposal" );
        require( proposals[id].isDone == false, "already done" );
        require( proposals[id].acceptingVotes >= proposals[id].requiredVotes, "not accepted proposal" );
        if( proposals[id].target == Target.TRAFFIC ) {
            TRAFFIC_AND_FIRST_BILLBOARD_CHECKER_API_URL = proposals[id].proposedURL;
        } else {
            BILLBOARD_CHECKER_API_URL = proposals[id].proposedURL;
        }

        proposals[id].isDone = true; // to prevent reapply this Url
    }

    function giveVote( uint id ) external {
        address msgSender = msg.sender;
        require( proposals[id].isVoted[ msgSender ] == false, 'already voted' );
        require( proposals[id].requiredVotes > 0, "not active proposal" );
        uint votingPower = balanceOf( msgSender );
        proposals[id].acceptingVotes += votingPower;
        proposals[id].isVoted[ msgSender ] = true;
    }

//saved as domain name in mapping
    struct BillboardShower {
        //string domainName;
        bool isActive;
        bool isBanned;
        uint rewardCoefficient;
        uint startTime;
        address ownerAddress;
    }

    mapping( uint => Advertisement) public advertisements; //time to ad
    uint public totalRevenue;





    function _distributeRevenue( uint value ) internal {
        uint tokenToBurn = value * BURN_RATE / 100;
        _burn( address(this), tokenToBurn );
        uint remaingTokens = value - tokenToBurn;
        totalRevenue += remaingTokens;
        billboardShowerPool += remaingTokens;
    }



    function changeAdURI( uint time, string calldata _imageURI ) external {
        time = time / AD_DURATION * AD_DURATION;
        address msgSender = msg.sender;
        Advertisement memory ad = advertisements[time];
        require( ad.owner == msgSender, 'not owner' );
        require( block.timestamp + LAST_URI_CHANGE_TIME <= time , 'last uri change time has passed');
        advertisements[time].imageURI = _imageURI;
    }

//dutch auction
    function getStartPrice( uint time ) public view returns( uint ) {
        time = time / AD_DURATION * AD_DURATION;
        //get same time 2 days ago
        uint lastTime = time - 2 days;
        Advertisement memory ad = advertisements[lastTime];
        uint lastPrice = ad.startPrice;
        uint bidTime = ad.bidTime;
        //converts int
        //coefficient = ( (lastTime - bidTime) * (lastTime - bidTime) ) / (( BID_START_TIME - LAST_BID_TIME ) * ( BID_START_TIME - LAST_BID_TIME ))
        //optimizing price for more ad buying, coefficient is between 0 and 1 
        // lastPrice * (coefficient * 4 + 0.5) = lastPrice * coefficient * 4 + lastPrice / 2
        uint calculatedPrice = 4 * lastPrice * (lastTime - bidTime) * (lastTime - bidTime) / ( ( BID_START_TIME - LAST_BID_TIME ) * ( BID_START_TIME - LAST_BID_TIME ) ) + lastPrice / 2;
        if( calculatedPrice == 0 ) {
            calculatedPrice = DEFAULT_PRICE / 2;
        }
         return calculatedPrice;
    }



    function getCurrentPrice( uint time ) public view returns( uint ) {
        time = time / AD_DURATION * AD_DURATION;
        // startPrice * remaining time / total duration
        return getStartPrice( time ) * (time - LAST_BID_TIME - block.timestamp) / ( BID_START_TIME - LAST_BID_TIME );
    }


    function buyAd( uint time, string calldata _imageURI ) external {
        time = time / AD_DURATION * AD_DURATION;
        Advertisement memory ad = advertisements[time];
        require( ad.owner == address(0), 'already bought' );
        address msgSender = msg.sender;
        uint price = getCurrentPrice( time );
        require( balanceOf( msgSender ) >= price, 'balance is not enough' );
        uint now = block.timestamp;
        require( now + LAST_BID_TIME < time, 'bid time has expired' );
        require( now > time - BID_START_TIME, 'bid time has not started' );

        _transfer( msgSender, address(this), price );
        Advertisement storage adStorage = advertisements[time];
        adStorage.imageURI = _imageURI;
        adStorage.startPrice = getStartPrice( time );
        adStorage.bidAmount = price;
        adStorage.bidTime = now;
        adStorage.owner = msgSender;
        _distributeRevenue( price );

        emit AdBuy( time, _imageURI );
    }

//reward distrubiton
//%80 billboard showers, %20 burn(therefore, token holders earn)

//billboard (ad) showers
    //reward coefficent increases hourly to prevent overflowing all coefficents sum and prevent rewarding token to misapplication of billboard



    function beBillboardShower( string calldata _domainName ) external {
        BillboardShower memory billboardShower = billboardShowers[ _domainName ];
        BillboardShower storage store = billboardShowers[ _domainName ];
        require( billboardShower.isActive == false, 'already became' );
        require( billboardShower.isBanned == false, 'banned domain' );
        store.startTime = block.timestamp;
        store.ownerAddress = msg.sender;

        requestTrafficData( Target.TRAFFIC, _domainName);
    }



    function deactivateBillboardShower( string calldata _domainName ) external {
        BillboardShower memory billboardShower = billboardShowers[ _domainName ];
        require( billboardShower.ownerAddress == msg.sender, 'not owner' );
        require( billboardShower.isActive == true, 'already not active' );
        withdrawReward( _domainName );
        billboardShowers[ _domainName ].isActive = false;
        currentCoefficientSum -= billboardShower.rewardCoefficient;
        

    }



    //web traffic api can be changable with DAO proposals by anyone. If proposal reach a consensus of half of total supply it becoming new API.
    //chainlink
    function reportBillboardShower( string calldata _domainName ) external {
        BillboardShower memory billboardShower = billboardShowers[ _domainName ];
        require( billboardShower.isActive == true, 'not active' );
        require( billboardShower.isBanned == false, 'already banned' );
        requestTrafficData( Target.BILLBOARD_CHECKER, _domainName);
    }

    function getReward( string calldata _domainName ) external view returns(uint) {
        uint time = block.timestamp;
        BillboardShower memory billboardShower = billboardShowers[ _domainName ];
        uint currentAdShowerCoefficient = billboardShower.rewardCoefficient * (time - billboardShower.startTime);
        uint currentTotalCoefficient = lastTotalCoefficient + (time - lastTotalCoefficientRefreshTime) * currentCoefficientSum;
        uint reward = billboardShowerPool * currentAdShowerCoefficient / currentTotalCoefficient / COEFFICENT_INCREASE_PERIOD * COEFFICENT_INCREASE_PERIOD;
        return reward;
    }

    function getCurrentTotalCoefficient() external view returns( uint ) {
        uint time = block.timestamp;
        uint currentTotalCoefficient = lastTotalCoefficient + (time - lastTotalCoefficientRefreshTime) * currentCoefficientSum;
        return currentTotalCoefficient;
    }

    function getCurrentAdShowerCoefficent( string calldata _domainName ) external view returns(uint) {
        BillboardShower memory billboardShower = billboardShowers[ _domainName ];
        uint currentAdShowerCoefficient = billboardShower.rewardCoefficient * (block.timestamp - billboardShower.startTime);
        return currentAdShowerCoefficient;
    }

    function withdrawReward( string calldata _domainName ) public {
        BillboardShower memory billboardShower = billboardShowers[ _domainName ];
        require( billboardShower.isActive == true, 'must be active' );
        uint time = block.timestamp;
        // pool * user's current coeffiecnt / current total coefficient
        uint currentAdShowerCoefficient = billboardShower.rewardCoefficient * (time - billboardShower.startTime);
        uint currentTotalCoefficient = lastTotalCoefficient + (time - lastTotalCoefficientRefreshTime) * currentCoefficientSum;
        uint reward = billboardShowerPool * currentAdShowerCoefficient / currentTotalCoefficient / COEFFICENT_INCREASE_PERIOD * COEFFICENT_INCREASE_PERIOD;
        _transfer( address(this),  billboardShower.ownerAddress, reward );
        billboardShowerPool -= reward;
        lastTotalCoefficient = currentTotalCoefficient - currentAdShowerCoefficient;
        lastTotalCoefficientRefreshTime = time;
        billboardShowers[ _domainName ].startTime = time;

    }

    function getCurrentAd() external view returns( string memory ) {
        uint time = block.timestamp;
        time = time / AD_DURATION * AD_DURATION;

        return advertisements[ time ].imageURI;
    }

    //both limits are included
    function getAdvertisementArray( uint startTime, uint finishTime ) external view returns( Advertisement[] memory ) {
        startTime = startTime / AD_DURATION * AD_DURATION;
        finishTime = finishTime / AD_DURATION * AD_DURATION;
        uint count = (finishTime - startTime) / AD_DURATION + 1;
        Advertisement[] memory ads = new Advertisement[]( count );
        uint counter = 0;
        for( uint i = startTime; i <= finishTime; i+= AD_DURATION ) {
            ads[ counter ] = advertisements[ i ];
            ++counter;
        }
        return ads;
    }


    mapping( address => bool ) isMinted;
    function mockMintTokens() external {
        address msgSender = msg.sender;
        require( isMinted[ msgSender ] == false, 'already minted' );
        isMinted[ msgSender ] = true;
        _mint(msgSender, 100 * 10 ** decimals());
    } 

}
