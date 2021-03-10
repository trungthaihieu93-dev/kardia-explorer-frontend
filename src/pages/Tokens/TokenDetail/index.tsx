import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Col, FlexboxGrid, Icon, Panel, Nav } from 'rsuite';
import FlexboxGridItem from 'rsuite/lib/FlexboxGrid/FlexboxGridItem';
import { useViewport } from '../../../context/ViewportContext';
import './style.css'
import { numberFormat } from '../../../common/utils/number';
import Transfers from './Transfers';
import { getContractInfor } from '../../../service/kai-explorer';
import { renderHashToRedirect } from '../../../common/utils/string';
import logodefault from '../../../resources/logodefault.svg';

const TokenDetail = () => {
    const { contractAddress }: any = useParams()
    let history = useHistory();
    const { isMobile } = useViewport();
    const [loading, setLoading] = useState(false);
    const [activeKey, setActiveKey] = useState('validators')
    const [tokenInfor, setTokenInfor] = useState({} as any);

    useEffect(() => {
        (async () => {
            setLoading(true);
            const rs = await getContractInfor(contractAddress);
            setTokenInfor(rs);
            setLoading(false);
        })()
    }, [])

    return (
        <div className="container txs-container">
            <div style={{ marginBottom: 10 }}>
                <img src={tokenInfor.logo ? tokenInfor.logo : logodefault} style={{ width: '28px', height: '28px', marginRight: '10px' }} alt="logo" />
                <span className="color-white">Token {tokenInfor.tokenSymbol}</span>
            </div>

            <FlexboxGrid>
                <FlexboxGridItem colspan={24} md={24} sm={24} style={{ marginRight: !isMobile ? 5 : 0, borderRadius: 8 }} className="wrap-token">
                    <Panel bordered header="Overview [KRC-20]">
                        <div className="row" style={{ display: 'flex' }}>
                            <div className="left" style={{ flex: 1, borderRight: '1px solid gray' }}>
                                <p className="color-graylight">Price: $ </p>
                            </div>

                            <div className="right" style={{ flex: 1, paddingLeft: '24px' }}>
                                <p className="color-graylight">FULLY DILUTED MARKET CAP: $ </p>
                            </div>
                        </div>

                        <div className="row">
                            <p className="flex3 color-graylight">Max Total Supply:</p>
                            <span className="flex9 color-graylight">{numberFormat(tokenInfor.totalSupply)} {tokenInfor.tokenSymbol}</span>
                        </div>

                        <div className="row">
                            <p className="flex3 color-graylight">Holders:</p>
                            <span className="flex9 color-graylight">{numberFormat(tokenInfor.holderCount)}</span>
                        </div>

                        <div className="row no-border">
                            <p className="flex3 color-graylight">Transfers:</p>
                            <span className="flex9 color-graylight">

                            </span>
                        </div>

                    </Panel>
                </FlexboxGridItem>

                <FlexboxGridItem colspan={24} md={24} sm={24} style={{ marginLeft: !isMobile ? 5 : 0, borderRadius: 8 }} className="wrap-token">
                    <Panel bordered header="Profile Summary">
                        <div className="row">
                            <p className="flex3 color-graylight">Contract:</p>
                            <span className="flex9 color-graylight">
                                {
                                    renderHashToRedirect({
                                        hash: tokenInfor.address,
                                        headCount: isMobile ? 5 : 20,
                                        tailCount: 15,
                                        showTooltip: false,
                                        redirectTo: `/address/${tokenInfor.address}`
                                    })
                                }
                            </span>
                        </div>

                        <div className="row">
                            <p className="flex3 color-graylight">Decimals:</p>
                            <span className="flex9 color-graylight">{tokenInfor.decimals}</span>
                        </div>

                        <div className="row">
                            <p className="flex3 color-graylight">Official Site:</p>
                            <span className="flex9 color-graylight"></span>
                        </div>

                        <div className="row no-border" style={{ display: 'flex' }}>
                            <p className="flex3 color-graylight">Social Profiles: </p>
                            <ul className="flex9 social" style={{ display: 'flex', paddingLeft: 0 }}>
                                <li><a href="#" target="_blank" rel="noopener noreferrer" className="footer-icon" ><Icon icon="medium" size={"lg"} /></a></li>
                                <li><a href="#" target="_blank" rel="noopener noreferrer" className="footer-icon" ><Icon icon="twitter" size={"lg"} /></a></li>
                                <li><a href="#" target="_blank" rel="noopener noreferrer" className="footer-icon" ><Icon icon="telegram" size={"lg"} /></a></li>
                                <li><a href="#" target="_blank" rel="noopener noreferrer" className="footer-icon" ><Icon icon="facebook" size={"lg"} /></a></li>
                                <li><a href="#" target="_blank" rel="noopener noreferrer" className="footer-icon" ><Icon icon="instagram" size={"lg"} /></a></li>
                                <li><a href="#" target="_blank" rel="noopener noreferrer" className="footer-icon" ><Icon icon="youtube" size={"lg"} /></a></li>
                                <li><a href="#" target="_blank" rel="noopener noreferrer" className="footer-icon" ><Icon icon="reddit" size={"lg"} /></a></li>
                                <li><a href="#" target="_blank" rel="noopener noreferrer" className="footer-icon" ><Icon icon="linkedin" size={"lg"} /></a></li>
                            </ul>
                        </div>
                    </Panel>
                </FlexboxGridItem>
            </FlexboxGrid>

            <FlexboxGrid justify="space-between">
                <FlexboxGrid.Item componentClass={Col} colspan={24} md={24}>
                    <Panel shaded className="panel-bg-gray">
                        <div className="custom-nav">
                            <Nav
                                appearance="subtle"
                                activeKey={activeKey}
                                onSelect={setActiveKey}
                                style={{ marginBottom: 20 }}>
                                <Nav.Item eventKey="validators">
                                    {`Transfers`}
                                </Nav.Item>
                                <Nav.Item eventKey="candidates">
                                    {`Holders`}
                                </Nav.Item>
                            </Nav>
                        </div>
                        {
                            (() => {
                                switch (activeKey) {
                                    case 'validators':
                                        return (
                                            <Transfers />
                                        );

                                }
                            })()
                        }
                    </Panel>
                </FlexboxGrid.Item>
            </FlexboxGrid>

        </div>
    )
}
export default TokenDetail;