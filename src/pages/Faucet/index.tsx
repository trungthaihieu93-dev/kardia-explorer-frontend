import React, { useState } from 'react'
import { Alert, Button, ButtonToolbar, Col, FlexboxGrid, Form, FormControl, FormGroup, Message, Panel } from 'rsuite';
import ErrMessage from '../../common/components/InputErrMessage/InputErrMessage';
import { ErrorMessage } from '../../common/constant/Message';
import { renderHashString, renderHashToRedirect } from '../../common/utils/string';
import { addressValid } from '../../common/utils/validate';
import { FAUCET_ENDPOINT } from '../../config/api';
import './faucet.css';

const Faucet = () => {
    
    const [walletAddress, setWalletAddress] = useState('')
    const [walletAddrErr, setWalletAddrErr] = useState('')
    const [hashTransaction, setHashTransaction] = useState('')

    const validateWalletAddr = () => {
        if (!walletAddress) {
            setWalletAddrErr(ErrorMessage.Require)
            return false
        }
        if (!addressValid(walletAddress)) {
            setWalletAddrErr(ErrorMessage.AddressInvalid)
            return false
        }
        setWalletAddrErr('')
        return true
    }

    const sendKai = async () => {
        if (!validateWalletAddr()) return;
        const requestOptions = {
            method: 'GET'
        };
        const response = await fetch(`${FAUCET_ENDPOINT}/giveFaucet?address=${walletAddress}`, requestOptions)
        const responseJSON = await response.json();

        if (responseJSON && responseJSON.error) {
            Alert.error(responseJSON.error, 5000);
            return
        }

        if(responseJSON && responseJSON.warning) {
            Alert.warning(responseJSON.warning, 5000);
            return
        }
        setHashTransaction(responseJSON.txHash)
        Alert.success('Congratulations! You had received 100 KAI free.', 5000);
    }

    return (
        <FlexboxGrid justify="center" className="container">
            <FlexboxGrid.Item componentClass={Col} colspan={22} md={14}>
                <Panel header={<h3>Received free KAIs with KardiaChain Faucet</h3>} shaded>
                    <Form fluid>
                        <FormGroup>
                            <FormControl
                                placeholder="Wallet address"
                                name="walletAddress"
                                value={walletAddress}
                                onChange={(value) => {
                                    if(!value) setWalletAddrErr(ErrorMessage.Require);
                                    setWalletAddress(value)
                                }}
                                type="text" />
                            <ErrMessage message={walletAddrErr} />
                        </FormGroup>
                        <FormGroup>
                            <ButtonToolbar>
                                <Button appearance="primary" onClick={sendKai}>Send me some KAI</Button>
                            </ButtonToolbar>
                        </FormGroup>
                    </Form>
                    {
                        hashTransaction ? <div style={{ marginTop: '20px', wordBreak: 'break-all'}}>Transaction hash: {renderHashToRedirect({ hash: hashTransaction, headCount: 100, tailCount: 4, callback: () => { window.open(`/tx/${hashTransaction}`) } })}</div> : <></>
                    }
                    <Message className="faucet-warning" type="warning" description="These tokens are for testing purpose only. They can't be used to trade or pay for any services." />
                </Panel>
            </FlexboxGrid.Item>
        </FlexboxGrid>
    )
}

export default Faucet;