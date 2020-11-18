import React, { useEffect, useState } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import { Col, FlexboxGrid, List, Panel, Tag, Placeholder, Icon, IconButton, Alert, Nav, Input } from 'rsuite';
import Button from '../../common/components/Button';
import { weiToKAI } from '../../common/utils/amount';
import { numberFormat } from '../../common/utils/number';
import { copyToClipboard, dateToLocalTime, renderHashString, renderHashToRedirect } from '../../common/utils/string';
import { TIME_INTERVAL_MILISECONDS } from '../../config/api';
import { getTxByHash } from '../../service/kai-explorer';
import './txDetail.css'

const onSuccess = () => {
    Alert.success('Copied to clipboard.')
}

const { Paragraph } = Placeholder;

const TxDetail = () => {
    const history = useHistory();
    const { txHash }: any = useParams();
    const [txDetail, setTxDetail] = useState<KAITransaction>()
    const [loading, setLoading] = useState(false)
    const [inputDataActiveKey, setInputDataActiveKey] = useState("origin")


    useEffect(() => {
        setLoading(true)
        // Refetch txD
        const fetchTxDetail = setInterval(async () => {
            const tx = await getTxByHash(txHash);
            if (tx.txHash) {
                setTxDetail(tx)
                setLoading(false)
                clearInterval(fetchTxDetail)
            }
        }, TIME_INTERVAL_MILISECONDS)
        return () => clearInterval(fetchTxDetail);
    }, [txHash])

    const onSelectInputData = (e: any) => {
        setInputDataActiveKey(e)
        
    }

    return (
        <div className="container tx-detail-container">
            <div className="block-title" style={{ padding: '0px 5px' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Icon className="highlight" icon="th" size={"2x"} />
                    <p style={{ marginLeft: '12px' }} className="title">Transaction Details</p>
                </div>
            </div>
            <Panel shaded>
                {
                    loading ? <Paragraph style={{ marginTop: 30 }} rows={20} /> :
                        <List bordered={false}>
                            <List.Item>
                                <FlexboxGrid justify="start" align="middle">
                                    <FlexboxGrid.Item componentClass={Col} colspan={24} md={4} xs={24}>
                                        <div className="property-title">Transaction Hash</div>
                                    </FlexboxGrid.Item>
                                    <FlexboxGrid.Item componentClass={Col} colspan={24} md={20} xs={24}>
                                        <div className="property-content">{renderHashString(txDetail?.txHash || '', 64)}</div>
                                    </FlexboxGrid.Item>
                                </FlexboxGrid>
                            </List.Item>
                            <List.Item>
                                <FlexboxGrid justify="start" align="middle">
                                    <FlexboxGrid.Item componentClass={Col} colspan={24} md={4} xs={24}>
                                        <div className="property-title">Block Number</div>
                                    </FlexboxGrid.Item>
                                    <FlexboxGrid.Item componentClass={Col} colspan={24} md={20} xs={24}>
                                        <div className="property-content">
                                            <Link to={`/block/${txDetail?.blockNumber}`} >{numberFormat(txDetail?.blockNumber)}</Link>
                                        </div>
                                    </FlexboxGrid.Item>
                                </FlexboxGrid>
                            </List.Item>
                            <List.Item>
                                <FlexboxGrid justify="start" align="middle">
                                    <FlexboxGrid.Item componentClass={Col} colspan={24} md={4} xs={24}>
                                        <div className="property-title">Block Hash</div>
                                    </FlexboxGrid.Item>
                                    <FlexboxGrid.Item componentClass={Col} colspan={24} md={20} xs={24}>
                                        <div className="property-content">
                                            {renderHashToRedirect({
                                                hash: txDetail?.blockHash,
                                                headCount: 70,
                                                tailCount: 4,
                                                showTooltip: true,
                                                callback: () => { history.push(`/block/${txDetail?.blockHash}`) },
                                                showCopy: true
                                            })}
                                        </div>
                                    </FlexboxGrid.Item>
                                </FlexboxGrid>
                            </List.Item>
                            <List.Item>
                                <FlexboxGrid justify="start" align="middle">
                                    <FlexboxGrid.Item componentClass={Col} colspan={24} md={4} xs={24}>
                                        <div className="property-title">Status</div>
                                    </FlexboxGrid.Item>
                                    <FlexboxGrid.Item componentClass={Col} colspan={24} md={20} xs={24}>
                                        {
                                            txDetail?.status ?
                                                <div className="property-content"><Tag color="green">SUCCESS</Tag></div> :
                                                <div className="property-content"><Tag color="red">FAILED</Tag></div>
                                        }
                                    </FlexboxGrid.Item>
                                </FlexboxGrid>
                            </List.Item>
                            <List.Item>
                                <FlexboxGrid justify="start" align="middle">
                                    <FlexboxGrid.Item componentClass={Col} colspan={24} md={4} xs={24}>
                                        <div className="property-title">TimeStamp</div>
                                    </FlexboxGrid.Item>
                                    <FlexboxGrid.Item componentClass={Col} colspan={24} md={20} xs={24}>
                                        <div className="property-content">{txDetail?.time ? dateToLocalTime(txDetail?.time) : ''}</div>
                                    </FlexboxGrid.Item>
                                </FlexboxGrid>
                            </List.Item>
                            <List.Item>
                                <FlexboxGrid justify="start" align="middle">
                                    <FlexboxGrid.Item componentClass={Col} colspan={24} md={4} xs={24}>
                                        <div className="property-title">From</div>
                                    </FlexboxGrid.Item>
                                    <FlexboxGrid.Item componentClass={Col} colspan={24} md={20} xs={24}>
                                        <div className="property-content">
                                            {renderHashToRedirect({
                                                hash: txDetail?.from,
                                                headCount: 50,
                                                tailCount: 4,
                                                showTooltip: true,
                                                callback: () => { history.push(`/address/${txDetail?.from}`) },
                                                showCopy: true
                                            })}
                                        </div>
                                    </FlexboxGrid.Item>
                                </FlexboxGrid>
                            </List.Item>
                            <List.Item>
                                <FlexboxGrid justify="start" align="middle">
                                    <FlexboxGrid.Item componentClass={Col} colspan={24} md={4} xs={24}>
                                        <div className="property-title">To</div>
                                    </FlexboxGrid.Item>
                                    <FlexboxGrid.Item componentClass={Col} colspan={24} md={20} xs={24}>
                                        {
                                            !txDetail?.toSmcAddr ? (
                                                <div className="property-content">{renderHashToRedirect({
                                                    hash: txDetail?.to,
                                                    headCount: 50,
                                                    tailCount: 4,
                                                    callback: () => { history.push(`/address/${txDetail?.to}`) },
                                                    showCopy: true
                                                })}</div>
                                            ) : (
                                                <div className="property-content"><Icon className="highlight" icon="file-text-o" style={{marginRight: 5}} /> {renderHashToRedirect({
                                                    hash: txDetail?.toSmcAddr,
                                                    headCount: 50,
                                                    tailCount: 4,
                                                    callback: () => { history.push(`/address/${txDetail?.toSmcAddr}`) },
                                                })} {txDetail.toSmcName} <IconButton
                                                size="xs"
                                                onClick={() => copyToClipboard(txDetail?.toSmcAddr || '', onSuccess)}
                                                icon={<Icon icon="copy" />}
                                            /></div>
                                            )
                                        }
                                    </FlexboxGrid.Item>
                                </FlexboxGrid>
                            </List.Item>
                            <List.Item>
                                <FlexboxGrid justify="start" align="middle">
                                    <FlexboxGrid.Item componentClass={Col} colspan={24} md={4} xs={24}>
                                        <div className="property-title">Value</div>
                                    </FlexboxGrid.Item>
                                    <FlexboxGrid.Item componentClass={Col} colspan={24} md={20} xs={24}>
                                        <div className="property-content">{numberFormat(weiToKAI(txDetail?.value))} KAI</div>
                                    </FlexboxGrid.Item>
                                </FlexboxGrid>
                            </List.Item>
                            <List.Item>
                                <FlexboxGrid justify="start" align="middle">
                                    <FlexboxGrid.Item componentClass={Col} colspan={24} md={4} xs={24}>
                                        <div className="property-title">Gas Price</div>
                                    </FlexboxGrid.Item>
                                    <FlexboxGrid.Item componentClass={Col} colspan={24} md={20} xs={24}>
                                        <div className="property-content">{numberFormat(txDetail?.gasPrice || 0)} OXY</div>
                                    </FlexboxGrid.Item>
                                </FlexboxGrid>
                            </List.Item>
                            <List.Item>
                                <FlexboxGrid justify="start" align="middle">
                                    <FlexboxGrid.Item componentClass={Col} colspan={24} md={4} xs={24}>
                                        <div className="property-title">Gas Limit</div>
                                    </FlexboxGrid.Item>
                                    <FlexboxGrid.Item componentClass={Col} colspan={24} md={20} xs={24}>
                                        <div className="property-content">{numberFormat(txDetail?.gas || 0)}</div>
                                    </FlexboxGrid.Item>
                                </FlexboxGrid>
                            </List.Item>
                            <List.Item>
                                <FlexboxGrid justify="start" align="middle">
                                    <FlexboxGrid.Item componentClass={Col} colspan={24} md={4} xs={24}>
                                        <div className="property-title">Gas Used</div>
                                    </FlexboxGrid.Item>
                                    <FlexboxGrid.Item componentClass={Col} colspan={24} md={20} xs={24}>
                                        <div className="property-content">{numberFormat(txDetail?.gasUsed || 0)}</div>
                                    </FlexboxGrid.Item>
                                </FlexboxGrid>
                            </List.Item>
                            <List.Item>
                                <FlexboxGrid justify="start" align="middle">
                                    <FlexboxGrid.Item componentClass={Col} colspan={24} md={4} xs={24}>
                                        <div className="property-title">Nonce</div>
                                    </FlexboxGrid.Item>
                                    <FlexboxGrid.Item componentClass={Col} colspan={24} md={20} xs={24}>
                                        <div className="property-content">{numberFormat(txDetail?.nonce || 0)}</div>
                                    </FlexboxGrid.Item>
                                </FlexboxGrid>
                            </List.Item>
                            <List.Item>
                                <FlexboxGrid justify="start" align="middle">
                                    <FlexboxGrid.Item componentClass={Col} colspan={24} md={4} xs={24}>
                                        <div className="property-title">Transaction Index</div>
                                    </FlexboxGrid.Item>
                                    <FlexboxGrid.Item componentClass={Col} colspan={24} md={20} xs={24}>
                                        <div className="property-content">{txDetail?.transactionIndex}</div>
                                    </FlexboxGrid.Item>
                                </FlexboxGrid>
                            </List.Item>
                            {
                                !txDetail?.input || txDetail?.input === '0x' ? <></> : (
                                    <List.Item>
                                        <FlexboxGrid justify="start" align="middle">
                                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={4} xs={24}>
                                                <div className="property-title">Input Data</div>
                                            </FlexboxGrid.Item>
                                            <FlexboxGrid.Item componentClass={Col} colspan={24} md={20} xs={24}>
                                                {/* <Nav appearance="tabs" activeKey={inputDataActiveKey} onSelect={(e) => { onSelectInputData(e) }}>
                                                    <Nav.Item eventKey="origin">
                                                        Original Data
                                                    </Nav.Item>
                                                    <Nav.Item eventKey="decode">Decode Data</Nav.Item>
                                                </Nav> */}
                                                {
                                                    inputDataActiveKey === "origin" ?
                                                        <div style={{marginTop: 10}}>
                                                                <Input
                                                                    componentClass="textarea"
                                                                    rows={5}
                                                                    // style={{ width:  }}
                                                                    placeholder="resize: 'auto'"
                                                                    value={txDetail?.input}
                                                                />
                                                                {/* <Button className="primary-button">Origin Data</Button> */}
                                                                <Button className="primary-button" onClick={() => (setInputDataActiveKey('decode'))} style={{margin: 0, marginTop: 20}}>Decode Data</Button>
                                                        </div>
                                                        : <div>Decode Data</div>
                                                }
                                            </FlexboxGrid.Item>
                                        </FlexboxGrid>
                                    </List.Item>
                                )
                            }
                        </List>
                }
            </Panel>
        </div>
    )
}

export default TxDetail;