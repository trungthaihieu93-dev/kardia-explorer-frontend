import React, { useState } from 'react';
import { Modal } from 'rsuite';
import { NotifiMessage, InforMessage, Button, NotificationError, NotificationSuccess } from '../../../../common';
import { useRecoilValue } from 'recoil';
import walletState from '../../../../atom/wallet.atom';
import { withdrawCommissionByEW, isExtensionWallet, withdrawCommission } from '../../../../service';

const WithdrawCommission = ({ validator = {} as Validator, showModel, setShowModel, reFetchData }: {
    validator: Validator;
    showModel: boolean;
    setShowModel: (isShow: boolean) => void;
    reFetchData: () => void;
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const walletLocalState = useRecoilValue(walletState);
    
    const widthdrawCommission = async () => {
        try {
            setIsLoading(true);
            const valSmcAddr = validator?.smcAddress || "";
            if (!valSmcAddr) {
                setIsLoading(false)
                return false;
            }

            // Case: withdraw commission rewards interact with Kai Extension Wallet
            if (isExtensionWallet()) {
                withdrawCommissionByEW(valSmcAddr)
                setIsLoading(false)
                setShowModel(false)
                return;
            }
            
            const result = await withdrawCommission(valSmcAddr, walletLocalState.account);
            if (result && result.status === 1) {
                NotificationSuccess({
                    description: NotifiMessage.TransactionSuccess,
                    callback: () => { window.open(`/tx/${result.transactionHash}`) },
                    seeTxdetail: true
                });
                reFetchData();
            } else {
                NotificationError({
                    description: NotifiMessage.TransactionError,
                    callback: () => { window.open(`/tx/${result.transactionHash}`) },
                    seeTxdetail: true
                });
            }
        } catch (error) {
            try {
                const errJson = JSON.parse(error?.message);
                NotificationError({
                    description: `${NotifiMessage.TransactionError} Error: ${errJson?.error?.message}`
                });
            } catch (error) {
                NotificationError({
                    description: NotifiMessage.TransactionError
                });
            }
        }
        setIsLoading(false);
        setShowModel(false);
    }

    return (
        <>
            {/* Modal confirm when withdraw commission amount */}
            <Modal backdrop="static" size="sm" enforceFocus={true} show={showModel} onHide={() => { setShowModel(false) }}>
                <Modal.Header>
                    <Modal.Title>Confirmation</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="confirm-letter" style={{ textAlign: 'center'}}>
                        {InforMessage.WithdrawCommissionRewardsConfirm}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button className="kai-button-gray" onClick={() => { setShowModel(false) }}>
                        Cancel
                    </Button>
                    <Button loading={isLoading} onClick={widthdrawCommission}>
                        Confirm
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default WithdrawCommission;