import React, { useMemo, useState } from 'react';
import Page from '../../components/Page';
import { createGlobalStyle } from 'styled-components';
import moment from 'moment';
import ProgressCountdown from '../Boardroom/components/ProgressCountdown';
import CountUp from 'react-countup';
import CardIcon from '../../components/CardIcon';
import TokenSymbol from '../../components/TokenSymbol';
import useBombStats from '../../hooks/useBombStats';
import useLpStats from '../../hooks/useLpStats';
import useLpStatsBTC from '../../hooks/useLpStatsBTC';
import useModal from '../../hooks/useModal';
import useZap from '../../hooks/useZap';
import useBondStats from '../../hooks/useBondStats';
import usebShareStats from '../../hooks/usebShareStats';
import useCurrentEpoch from '../../hooks/useCurrentEpoch';
import useTotalValueLocked from '../../hooks/useTotalValueLocked';
import useCashPriceInLastTWAP from '../../hooks/useCashPriceInLastTWAP';
import useCashPriceInEstimatedTWAP from '../../hooks/useCashPriceInEstimatedTWAP';
import useTreasuryAllocationTimes from '../../hooks/useTreasuryAllocationTimes';
import useTotalStakedOnBoardroom from '../../hooks/useTotalStakedOnBoardroom';
import useEarningsOnBoardroom from '../../hooks/useEarningsOnBoardroom';
import useStakedBalanceOnBoardroom from '../../hooks/useStakedBalanceOnBoardroom';
import useFetchBoardroomAPR from '../../hooks/useFetchBoardroomAPR';
// import { Bomb as bombTesting } from '../../bomb-finance/deployments/deployments.testing.json';
//import { Bomb as bombProd } from '../../bomb-finance/deployments/deployments.mainnet.json';
import { roundAndFormatNumber } from '../../0x';
import MetamaskFox from '../../assets/img/metamask-fox.svg';
import { Box, Button, Card, CardContent, Grid, Paper } from '@material-ui/core';
import ZapModal from '../Bank/components/ZapModal';
import { Alert } from '@material-ui/lab';
import { IoCloseOutline } from 'react-icons/io5';
import { BiLoaderAlt } from 'react-icons/bi';
import { makeStyles } from '@material-ui/core/styles';
import useBombFinance from '../../hooks/useBombFinance';
//import { ReactComponent as IconTelegram } from '../../assets/img/telegram.svg';
import { Helmet } from 'react-helmet';
import BombImage from '../../assets/img/bomb.png';

//import useBombMaxiStats from '../../hooks/useBombMaxiStats';

import HomeImage from '../../assets/img/background.jpg';
import { grey } from '../../theme/colors';
import BombFinanceProvider from '../../contexts/BombFinanceProvider';
const BackgroundImage = createGlobalStyle`
  body {
    background: url(${HomeImage}) repeat !important;
    background-size: cover !important;
    background-color: #171923;
  }
`;
const TITLE = 'bomb.money | Dashboard';

// const BackgroundImage = createGlobalStyle`
//   body {
//     background-color: grey;
//     background-size: cover !important;
//   }
// `;

const useStyles = makeStyles((theme) => ({
  button: {
    [theme.breakpoints.down('415')]: {
      // marginTop: '10px'
    },
  },
}));

const Dashboard = () => {
  const classes = useStyles();
  const TVL = useTotalValueLocked();
  const bombFtmLpStats = useLpStatsBTC('BOMB-BTCB-LP');
  const bShareFtmLpStats = useLpStats('BSHARE-BNB-LP');
  const bombStats = useBombStats();
  const bShareStats = usebShareStats();
  const tBondStats = useBondStats();
  const bombFinance = useBombFinance();
  const currentEpoch=useCurrentEpoch();
  const cashPriceInLastTwap=useCashPriceInLastTWAP();
  const cashPriceInEstimatedTWAP=useCashPriceInEstimatedTWAP();
  const { to } = useTreasuryAllocationTimes();
  const totalStakedOnBoardroom=useTotalStakedOnBoardroom();
  const earningsOnBoardroom=useEarningsOnBoardroom();
  const stakedBalanceOnBoardroom=useStakedBalanceOnBoardroom();
  const fetchBoardroomAPR=useFetchBoardroomAPR();
  const stakeToBomb=bombFinance.stakeToBomb();
  const withdrawtoBomb=bombFinance.withdrawFromBomb();
  const claimrewardsbomb=bombFinance.redeemFromBomb();
  // const bombmaxi = useBombMaxiStats('0xd6f52e8ab206e59a1e13b3d6c5b7f31e90ef46ef000200000000000000000028');

  // console.log(bombmaxi);
  // let bomb;
  // if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
  //   bomb = bombTesting;
  // } else {
  //   bomb = bombProd;
  // }

  const buyBombAddress = //'https://app.1inch.io/#/56/swap/BTCB/BOMB';
    //  'https://pancakeswap.finance/swap?inputCurrency=0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c&outputCurrency=' +
    'https://app.bogged.finance/bsc/swap?tokenIn=0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c&tokenOut=0x522348779DCb2911539e76A1042aA922F9C47Ee3';
  //https://pancakeswap.finance/swap?outputCurrency=0x531780FAcE85306877D7e1F05d713D1B50a37F7A';
  const buyBShareAddress = //'https://app.1inch.io/#/56/swap/BNB/BSHARE';
    'https://app.bogged.finance/bsc/swap?tokenIn=BNB&tokenOut=0x531780FAcE85306877D7e1F05d713D1B50a37F7A';
  const buyBusmAddress =
    'https://app.bogged.finance/bsc/swap?tokenIn=0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56&tokenOut=0x6216B17f696B14701E17BCB24Ec14430261Be94A';
  const bombLPStats = useMemo(() => (bombFtmLpStats ? bombFtmLpStats : null), [bombFtmLpStats]);
  const bshareLPStats = useMemo(() => (bShareFtmLpStats ? bShareFtmLpStats : null), [bShareFtmLpStats]);
  const bombPriceInDollars = useMemo(
    () => (bombStats ? Number(bombStats.priceInDollars).toFixed(2) : null),
    [bombStats],
  );
  const bombPriceInBNB = useMemo(() => (bombStats ? Number(bombStats.tokenInFtm).toFixed(4) : null), [bombStats]);
  const bombCirculatingSupply = useMemo(() => (bombStats ? String(bombStats.circulatingSupply) : null), [bombStats]);
  const bombTotalSupply = useMemo(() => (bombStats ? String(bombStats.totalSupply) : null), [bombStats]);

  const bSharePriceInDollars = useMemo(
    () => (bShareStats ? Number(bShareStats.priceInDollars).toFixed(2) : null),
    [bShareStats],
  );
  const bSharePriceInBNB = useMemo(
    () => (bShareStats ? Number(bShareStats.tokenInFtm).toFixed(4) : null),
    [bShareStats],
  );
  const bShareCirculatingSupply = useMemo(
    () => (bShareStats ? String(bShareStats.circulatingSupply) : null),
    [bShareStats],
  );
  const bShareTotalSupply = useMemo(() => (bShareStats ? String(bShareStats.totalSupply) : null), [bShareStats]);

  const tBondPriceInDollars = useMemo(
    () => (tBondStats ? Number(tBondStats.priceInDollars).toFixed(2) : null),
    [tBondStats],
  );
  const tBondPriceInBNB = useMemo(() => (tBondStats ? Number(tBondStats.tokenInFtm).toFixed(4) : null), [tBondStats]);
  const tBondCirculatingSupply = useMemo(
    () => (tBondStats ? String(tBondStats.circulatingSupply) : null),
    [tBondStats],
  );
  const tBondTotalSupply = useMemo(() => (tBondStats ? String(tBondStats.totalSupply) : null), [tBondStats]);

  const currentEpochvalue= useMemo(
    () => (currentEpoch ? Number(currentEpoch).toFixed(0) : null),
    [currentEpoch],
  );
  const TVLvalue= useMemo(
    () => (TVL ? Number(TVL).toFixed(3) : null),
    [TVL],
  );
  const CashPriceInLastTwapvalue= useMemo(
    () => (cashPriceInLastTwap? Number(cashPriceInLastTwap).toFixed(0) : null),
    [cashPriceInLastTwap],
  );
  const cashPriceInEstimatedTWAPvalue= useMemo(
    () => (cashPriceInEstimatedTWAP? Number(cashPriceInEstimatedTWAP).toFixed(0) : null),
    [cashPriceInEstimatedTWAP],
  );
  const totalStakedOnBoardroomvalue=useMemo(
    () => (totalStakedOnBoardroom? Number(totalStakedOnBoardroom).toFixed(0) : null),
    [totalStakedOnBoardroom],
  );
  const earningsOnBoardroomvalue=useMemo(
    () => (earningsOnBoardroom? Number(earningsOnBoardroom).toFixed(0) : null),
    [earningsOnBoardroom],
  );
  const stakedBalanceOnBoardroomvalue=useMemo(
    () => (stakedBalanceOnBoardroom? Number(stakedBalanceOnBoardroom).toFixed(0) : null),
    [stakedBalanceOnBoardroom],
  );
  const boardroomAPRvalue=useMemo(
    () => (fetchBoardroomAPR? Number(fetchBoardroomAPR).toFixed(0) : null),
    [fetchBoardroomAPR],
  );
  const bombLpZap = useZap({ depositTokenName: 'BOMB-BTCB-LP' });
  const bshareLpZap = useZap({ depositTokenName: 'BSHARE-BNB-LP' });

  const [onPresentBombZap, onDissmissBombZap] = useModal(
    <ZapModal
      decimals={18}
      onConfirm={(zappingToken, tokenName, amount) => {
        if (Number(amount) <= 0 || isNaN(Number(amount))) return;
        bombLpZap.onZap(zappingToken, tokenName, amount);
        onDissmissBombZap();
      }}
      tokenName={'BOMB-BTCB-LP'}
    />,
  );

  const [onPresentBshareZap, onDissmissBshareZap] = useModal(
    <ZapModal
      decimals={18}
      onConfirm={(zappingToken, tokenName, amount) => {
        if (Number(amount) <= 0 || isNaN(Number(amount))) return;
        bshareLpZap.onZap(zappingToken, tokenName, amount);
        onDissmissBshareZap();
      }}
      tokenName={'BSHARE-BNB-LP'}
    />,
  );

  const [modal, setModal] = useState(false);
  const [videoLoading, setVideoLoading] = useState(true);

  const openModal = () => {
    setModal(!modal);
  };

  const spinner = () => {
    setVideoLoading(!videoLoading);
  };

  // const [onPresentIntroVid] = useModal(
  //   <grid>
  //     <Paper>
  //       <div>
  //         <iframe
  //           width="560"
  //           height="315"
  //           src="https://www.youtube.com/embed/nhCWmmRNNhc"
  //           title="YouTube video player"
  //           frameborder="0"
  //           allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  //           allowfullscreen
  //         ></iframe>
  //       </div>
  //     </Paper>
  //   </grid>,
  // );

  return (
    <Page>
      <Helmet>
        <title>{TITLE}</title>
      </Helmet>
      <BackgroundImage />
      <Grid container>
        {/* part1 */}
        <Grid item xs={12} sm={8} style={{ margin: 'auto', marginTop: '0%' }} >
          <Paper >
            <Box p={4} style={{ textAlign: 'center', margin: 'auto' }}>
              <p>Bomb Finance Summary</p>
              <hr style={{ border: '1px solid grey', width: '90%', borderBottom: '0' }}></hr>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>

                  <table>

                    <thead>
                      <tr>
                        <th></th>
                        <th>Current Supply</th>
                        <th>Total Supply</th>
                        <th>Price</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><TokenSymbol symbol="BOMB" />$Bomb</td>
                        <td>{roundAndFormatNumber(bombCirculatingSupply, 2)}</td>
                        <td>{roundAndFormatNumber(bombTotalSupply, 2)}</td>
                        <td><p>${bombPriceInDollars ? roundAndFormatNumber(bombPriceInDollars, 2) : '-.--'}</p><p>{bombPriceInBNB ? bombPriceInBNB : '-.----'} BTC</p></td>
                        <td><img src={MetamaskFox}></img></td>
                      </tr>
                      <tr>
                        <td><TokenSymbol symbol="BSHARE" />$BSHARE</td>
                        <td> {roundAndFormatNumber(bShareCirculatingSupply, 2)}</td>
                        <td>{roundAndFormatNumber(bShareTotalSupply, 2)}</td>
                        <td><p>${bSharePriceInDollars ? bSharePriceInDollars : '-.--'}</p><p>{bSharePriceInBNB ? bSharePriceInBNB : '-.----'} BNB</p></td>
                        <td><img src={MetamaskFox}></img></td>
                      </tr>
                      <tr>
                        <td><TokenSymbol symbol="BBOND" />$BBOND</td>
                        <td>{roundAndFormatNumber(tBondCirculatingSupply, 2)}</td>
                        <td>{roundAndFormatNumber(tBondTotalSupply, 2)}</td>
                        <td><p>${tBondPriceInDollars ? tBondPriceInDollars : '-.--'}</p><p>{tBondPriceInBNB ? tBondPriceInBNB : '-.----'} BTC</p></td>
                        <td><img src={MetamaskFox}></img></td>
                      </tr>
                    </tbody>
                  </table>


                </div>

                <div>
                  <div>
                    <p>Current Epoch</p>
                    <p>{currentEpochvalue}</p>
                    <hr></hr>
                    <p><ProgressCountdown base={moment().toDate()} hideBar={true} deadline={to} description="Next Epoch" /></p>
                    <p>Next Epoch</p>
                    <hr></hr>
                    <p>Live Twap:{cashPriceInEstimatedTWAPvalue}</p>
                    <p>TVL:${TVLvalue}</p>
                    <p>Last Epoch TWAP:{CashPriceInLastTwapvalue}</p>
                  </div>
                </div>

              </div>
            </Box>
          </Paper>
        </Grid>
        {/* part2 */}
        <Grid item xs={12} sm={8} style={{ marginTop: '0%', paddingTop: '20px' }} >
          <div style={{ display: 'flex', width: '100vw', paddingLeft: '0' }}>
            <div style={{ marginRight: '10px', width: '60vw' }}>
              <div style={{ marginRight: '10px', display: 'flex', flexDirection: 'row-reverse' }}><a href='#' style={{ color: 'white' }}>Read Investment Strategy {'>'}</a></div>
              <Paper >
                <Box p={4} style={{ textAlign: 'center', margin: 'auto' }}>
                  <div style={{ backgroundColor: '#1680a3', marginBottom: '3px' }}><a href='#' style={{textDecoration:'none',color:'white'}}>Invest Now</a></div>
                  <div style={{ display: 'flex' }}>
                    <div style={{ backgroundColor: 'white', width: '50%', marginRight: '3px'}}><a href='#' style={{textDecoration:'none',color:'black'}}>Chat on Discord</a></div>
                    <div style={{ backgroundColor: 'white', width: '50%', marginLeft: '3px'}}><a href='#' style={{textDecoration:'none',color:'black'}}>Read Docs</a></div>
                  </div>
                  <hr style={{ border: '1px solid grey', width: '90%', borderBottom: '0' }}></hr>
                  <div style={{ marginTop: '6px' }}>
                    <div style={{ display: 'flex' }}><div style={{ display: 'inline-block' }}>Boardroom</div><div style={{ display: 'inline-block', marginLeft: '3px', padding: '2px', backgroundColor: 'green' }}>Recommended</div></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><div>stake BSHARE and earn BOMB every epoch</div><div>TVL: ${TVLvalue}</div></div>
                  </div>
                  <hr style={{ border: '1px solid grey', width: '90%', borderBottom: '0' }}></hr>
                  <div>
                    <div>
                      <div style={{ display: 'flex', flexDirection: 'row-reverse' }}>Total Staked:{totalStakedOnBoardroomvalue}</div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', width: '50%' }}>
                          <div>
                            <div>
                              Daily Returns:
                            </div>
                            <div>
                              {boardroomAPRvalue}
                            </div>
                          </div>
                          <div>
                            <div>
                              Your Stake
                            </div>
                            <div>
                              {stakedBalanceOnBoardroomvalue}
                            </div>
                            
                          </div>
                          <div>
                            <div>
                              Earned:
                            </div>
                            <div>
                              {earningsOnBoardroomvalue}
                            </div>
                            
                          </div>
                        </div>

                        <div style={{ width: '50%' }}>
                          <div style={{ display: 'flex', flexDirection: 'row-reverse' }}>
                            <div style={{ padding: '5px', border: '1px solid white', borderRadius: '30px', margin: '5px' }}>Withdraw</div>
                            <div style={{ padding: '5px', border: '1px solid white', borderRadius: '30px', margin: '5px' }}>Deposit</div>
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'row-reverse' }}><div style={{ padding: '5px', border: '1px solid white', borderRadius: '30px', margin: '5px' }}>Claim Rewards</div></div>
                        </div>
                      </div>


                    </div>

                  </div>
                </Box>
              </Paper>
            </div>
            <div style={{ width: "30vw" }}>
              <Paper >
                <Box p={4} style={{ textAlign: 'center', margin: 'auto' }}>
                  <div>Latest News</div>
                </Box>
              </Paper>
            </div>
          </div>

        </Grid>

        {/* part3 */}
        <Grid item xs={12} sm={8} style={{ margin: 'auto', marginTop: '10px' }} >
          <Paper >
            <Box p={4} style={{ textAlign: 'center', margin: 'auto' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex' }}>
                      Bomb Farms
                    </div>
                    <div>
                      stake your LP tokens in our farms to start earning $BSHARE
                    </div>
                  </div>
                  <div>
                    <div style={{ padding: '5px', border: '1px solid white', borderRadius: '30px', margin: '5px' }}>Claim Rewards</div>
                  </div>
                </div>
              </div>
              <div style={{ marginTop: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><div><div style={{ display: 'inline-block' }}>BOMB-BTCB</div><div style={{ display: 'inline-block', marginLeft: '3px', padding: '2px', backgroundColor: 'green' }}>Recommended</div></div><div>TVL:{TVLvalue}</div></div>
              </div>
              <hr style={{ border: '1px solid grey', width: '90%', borderBottom: '0' }}></hr>
              <div>
                <div>

                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '50%' }}>
                      <div>
                        <div>
                          Daily Returns:
                        </div>
                        <div>
                          2%
                        </div>
                      </div>
                      <div>
                        <div>
                          Your Stake
                        </div>
                        <div>
                          124.21
                        </div>
                        <div>
                          $1171.62
                        </div>
                      </div>
                      <div>
                        <div>
                          Earned:
                        </div>
                        <div>
                          1660.4413
                        </div>
                        <div>
                          $298.88
                        </div>
                      </div>
                    </div>

                    <div style={{ width: '50%' }}>
                      <div style={{ display: 'flex', flexDirection: 'row-reverse' }}>
                        <div style={{ padding: '5px', border: '1px solid white', borderRadius: '30px', margin: '5px' }}>Withdraw</div>
                        <div style={{ padding: '5px', border: '1px solid white', borderRadius: '30px', margin: '5px' }}>Deposit</div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'row-reverse' }}><div style={{ padding: '5px', border: '1px solid white', borderRadius: '30px', margin: '5px' }}>Claim Rewards</div></div>
                    </div>
                  </div>


                </div>

              </div>
              <hr style={{ border: '1px solid grey', width: '90%', borderBottom: '0' }}></hr>

              <div style={{ marginTop: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><div><div style={{ display: 'inline-block' }}>BSHARE-BNB</div><div style={{ display: 'inline-block', marginLeft: '3px', padding: '2px', backgroundColor: 'green' }}>Recommended</div></div><div>TVL: ${TVLvalue}</div></div>
              </div>
              <hr style={{ border: '1px solid grey', width: '90%', borderBottom: '0' }}></hr>
              <div>
                <div>

                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '50%' }}>
                      <div>
                        <div>
                          Daily Returns:
                        </div>
                        <div>
                          2%
                        </div>
                      </div>
                      <div>
                        <div>
                          Your Stake
                        </div>
                        <div>
                          124.21
                        </div>
                        <div>
                          $1171.62
                        </div>
                      </div>
                      <div>
                        <div>
                          Earned:
                        </div>
                        <div>
                          1660.4413
                        </div>
                        <div>
                          $298.88
                        </div>
                      </div>
                    </div>

                    <div style={{ width: '50%' }}>
                      <div style={{ display: 'flex', flexDirection: 'row-reverse' }}>
                        <div style={{ padding: '5px', border: '1px solid white', borderRadius: '30px', margin: '5px' }}>Withdraw</div>
                        <div style={{ padding: '5px', border: '1px solid white', borderRadius: '30px', margin: '5px' }}>Deposit</div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'row-reverse' }}><div style={{ padding: '5px', border: '1px solid white', borderRadius: '30px', margin: '5px' }}>Claim Rewards</div></div>
                    </div>
                  </div>


                </div>

              </div>

            </Box>
          </Paper>
        </Grid>
        {/* part4 */}
        <Grid item xs={12} sm={8} style={{ margin: 'auto', marginTop: '10px' }} >
          <Paper >
            <Box p={4} style={{ textAlign: 'center', margin: 'auto' }}>
              <div style={{ padding: '10px' }}>
                <div style={{ display: 'flex' }}>
                  Bonds
                </div>
                <div style={{ display: 'flex' }}>
                  BBOND can be purchased only on contraction periods, when TWAP of BOMB is below 1
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>

                <div style={{ display: 'flex', justifyContent: 'space-between',width:'50%' }}>

                  <div>
                    <div>Current Price: [BOMB]^2</div>
                    <div>BBOND= 6.2872 BTCB</div>
                  </div>
                  <div>
                    <div>Available to redeem:</div>
                    <div>456</div>
                  </div>
                </div>
                <div>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <div>
                        <div>Purchase BBond</div>
                        <div>Bomb if over peg</div>
                      </div>
                      <div style={{ padding: '5px', border: '1px solid white', borderRadius: '30px', margin: '5px' }}>Purchase</div>
                    </div>
                    <hr style={{ border: '1px solid grey', width: '90%', borderBottom: '0' }}></hr>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <div>
                        <div>Redeem Bomb</div>
                      </div>
                      <div style={{ padding: '5px', border: '1px solid white', borderRadius: '30px', margin: '5px' }}>Redeem</div>
                    </div>

                  </div>
                </div>


              </div>
              
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Page>
  );
};

export default Dashboard;
