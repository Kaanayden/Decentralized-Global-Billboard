// SPDX-License-Identifier: MIT


import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";


pragma solidity ^0.8.0;
contract DecentralizedGlobalBillboard is ERC20, ERC20Burnable, ERC20Permit {

//10 million tokens initial
    constructor() ERC20("Billboard", "BBRD") ERC20Permit("Billboard") {
        _mint(msg.sender, 10000000 * 10 ** decimals());
    } 

    uint constant LAST_URI_CHANGE_TIME = 2 minutes;
    uint constant LAST_BID_TIME = 10 minutes;
    uint constant BID_START_TIME = 2 days;
    uint constant DEFAULT_PRICE = 0.01 ether;
    uint constant AD_DURATION = 1 minutes;
    uint constant BURN_RATE = 20;

    

//Billboard showers
    uint constant COEFFICENT_INCREASE_PERIOD = 1 hours;
    //uint constant COEFFICENT_INCREASE_START_DURATION = 24 hours; //to give time to reporters
    //uint constant MINUS_PER_SHOWER = COEFFICENT_INCREASE_START_DURATION / COEFFICENT_INCREASE_PERIOD;
    //uint public billboardShowerNumber;
    string[] public billboardShowersDomainNames;
    uint public totalCoefficient;
    uint public billboardShowerPool;

    mapping( string => BillboardShower ) public billboardShowers;

    struct Advertisement {
        string imageURI;
        uint startPrice;
        uint bidAmount;
        uint bidTime;
        address owner;
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


    //erc20 yap

    distributeRevenue( uint value ) {
        uint tokenToBurn = value * BURN_RATE / 100;
        _burn( address(this), tokenToBurn );
        uint remaingTokens = value - tokenToBurn;
        totalRevenue += remaingTokens;
        billboardShowerPool += remaingTokens;
    }


    //sahip olduğu adleri göstererek yapılabilir
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
        Advertisement memory ad = advertisements[time];
        uint lastPrice = ad.startPrice;
        uint bidTime = ad.bidTime;
        //converts int
        //coefficient = ( (lastTime - bidTime) * (lastTime - bidTime) ) / (( BID_START_TIME - LAST_BID_TIME ) * ( BID_START_TIME - LAST_BID_TIME ))
        //optimizing price for more ad buying, coefficient is between 0 and 1 
        // lastPrice * (coefficient * 4 + 0.5) = lastPrice * coefficient * 4 + lastPrice / 2
        uint calculatedPrice = 4 * lastPrice * (lastTime - bidTime) * (lastTime - bidTime) / ( ( BID_START_TIME - LAST_BID_TIME ) * ( BID_START_TIME - LAST_BID_TIME ) ) + lastPrice / 2;
        if( calculatedPrice == 0 ) {
            calculatedPrice = lastPrice / 2;
        }
         return calculatedPrice;
    }

        function getMockStartPrice( uint time, uint lastPrice, uint bidTime ) public view returns( uint ) {
        time = time / AD_DURATION * AD_DURATION;
        //get same time 2 days ago
        uint lastTime = time - 2 days;
        //uint lastPrice = advertisements[ lastTime ].bidAmount;
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

    function getCurrentMockPrice( uint time, uint lastPrice, uint bidTime, uint now ) public view returns( uint ) {
        time = time / AD_DURATION * AD_DURATION;
        // startPrice * remaining time / total duration
        return getMockStartPrice( time, lastPrice, bidTime ) * (time - LAST_BID_TIME - now) / ( BID_START_TIME - LAST_BID_TIME );
    }

        function twoDays(  ) public view returns( uint ) {

         return 2 days;
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
        distributeRevenue( price );
    }

//reward distrubiton
//%80 billboard showers, %20 burn(so token holders earn), birazıyla da link ödemeli aslında

//billboard (ad) showers
    //reward coefficent increases hourly to prevent overflowing all coefficents sum and prevent rewarding token to misapplication of billboard


    //bunda chainlink gerek yok(varmış reward coefficent hesaplanması lazım)
    //deposit yatırsa iyi olabilir aslında sahteyi önlemek için ve belki bi kez kontrolden geçse iyi olabiir ?
    function beBillboardShower(
        string calldata _domainName,
        uint _rewardCoefficient ) external {
                BillboardShower memory billboardShower = billboardShowers[ _domainName ];
                BillboardShower storage store = billboardShowers[ _domainName ];
                require( billboardShower.isActive == false, 'already became' );
                require( billboardShower.isBanned == false, 'banned domain' );
                store.startTime = block.timestamp;
                store.ownerAddress = msg.sender;

        afterBeAPIRequest( _domainName, _rewardCoefficient );
    }



    function afterBeAPIRequest( string calldata _domainName, uint _rewardCoefficient ) public {

        billboardShowers[ _domainName ].isActive = true;
        billboardShowers[ _domainName ].rewardCoefficient = _rewardCoefficient;
        billboardShowersDomainNames.push( _domainName );
        totalCoefficient += _rewardCoefficient;
    }


    function deactivateBillboardShower( string calldata _domainName ) external {
        require( billboardShowers[ _domainName ].ownerAddress == msg.sender, 'not owner' );
        billboardShowers[ _domainName ].isActive = false;

    }

    //ingilizceye çevir
    //ipfs api .com, .com.tr ya da .net vb'le mi bitiyor diye kontrol edecek ve urlden sonraki kısma bakacak mesela *'sa ona göre değilse ona göre javascript kontrol edecek girilen parametreye göre

    //web traffic api'ı farklı kod olacak ve DAO karar verecek
    //chainlink
    function reportBillboardShower( string calldata _domainName ) external {

    }



    

}
