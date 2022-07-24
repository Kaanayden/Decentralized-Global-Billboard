{
    <div>
				{billBoardShowers.map((shower)=>{
					return(
						<div>
							{shower.isActive}
							{shower.isBanned}
							{shower.rewardCoefficent}
							{shower.startTime}
							{shower.ownerAddress}
						</div>
					)
				})}
			</div> } 