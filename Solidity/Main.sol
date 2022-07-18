// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;
contract DecentralizedGlobalBillboard {

    uint public constant LAST_URI_CHANGE_TIME = 2 minutes;
    uint public constant LAST_BID_TIME = 10 minutes;
    uint public constant BID_START_TIME = 2 days;
    uint public constant DEFAULT_PRICE = 0.01 ether;
    uint public constant AD_DURATION = 1 minutes;

    uint public totalRevenue;

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
        string selectedURLs;
        string isBanned;
        uint rewardCoefficient;
    }

mapping( uint => Advertisement) public advertisements; //time to ad



    //erc20 yap


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

    function buyAd( uint time, string calldata _imageURI ) external payable {
        time = time / AD_DURATION * AD_DURATION;
        Advertisement memory ad = advertisements[time];
        require( ad.owner == address(0), 'already bought' );
        uint msgValue = msg.value;
        require( msgValue > getCurrentPrice( time ), 'value is not enough' );
        uint now = block.timestamp;
        require( now + LAST_BID_TIME < time, 'bid time has expired' );
        require( now > time - BID_START_TIME, 'bid time has not started' );

        totalRevenue += msgValue;
        Advertisement storage adStorage = advertisements[time];
        adStorage.imageURI = _imageURI;
        adStorage.startPrice = getStartPrice( time );
        adStorage.bidAmount = msgValue;
        adStorage.bidTime = now;
        adStorage.owner = msg.sender;
    }

//reward distrubiton
//%80 billboard showers, %20 burn(so token holders earn)

//billboard (ad) showers
    //reward coefficent increases hourly to prevent overflowing all coefficents sum and prevent rewarding token to misapplication of billboard


    //ingilizceye çevir
    //ipfs api .com'la mı bitiyor diye kontrol edecek ve urlden sonraki kısma bakacak mesela *'sa ona göre değilse ona göre javascript kontrol edecek girilen parametreye göre

    //web traffic api'ı farklı kod olacak ve DAO karar verecek

    function reportBillBoardShower( string calldata _domainName, string calldata _reportURL ) external {

    }



    

}
