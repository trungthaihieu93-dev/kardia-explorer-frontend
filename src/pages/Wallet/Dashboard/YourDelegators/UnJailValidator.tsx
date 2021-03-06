import React, { useState } from 'react';
import { Modal } from 'rsuite';
import { NotifiMessage, Button, NotificationError, NotificationSuccess } from '../../../../common';
import { useRecoilValue } from 'recoil';
import walletState from '../../../../atom/wallet.atom';
import { unjailValidatorByEW, isExtensionWallet, unjailValidator } from '../../../../service';

const UnJailValidator = ({ validator = {} as Validator, showModel, setShowModel, reFetchData }: {
    validator: Validator;
    showModel: boolean;
    setShowModel: (isShow: boolean) => void;
    reFetchData: () => void;
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const walletLocalState = useRecoilValue(walletState);

    const unJailValidator = async () => {
        try {
            setIsLoading(true);
            const valSmcAddr = validator?.smcAddress || "";
            if (!valSmcAddr) {
                setIsLoading(false);
                return false;
            }

            // Case: Unjail validator interact with Kai Extension Wallet
            if (isExtensionWallet()) {
                unjailValidatorByEW(valSmcAddr)
                setShowModel(false)
                setIsLoading(false)
                return
            }

            const result = await unjailValidator(valSmcAddr, walletLocalState.account);
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
        setShowModel(false);
        setIsLoading(false);
    }

    return (
        <>
            {/* Modal confirm when unjail validator */}
            <Modal backdrop="static" size="sm" enforceFocus={true} show={showModel} onHide={() => { setShowModel(false) }}>
                <Modal.Header>
                    <Modal.Title>Confirm unjail validator</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="confirm-letter" style={{ textAlign: 'center'}}>
                        Are you sure you want to unjail for your validator
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button className="kai-button-gray" onClick={() => { setShowModel(false) }}>
                        Cancel
                    </Button>
                    <Button loading={isLoading} onClick={unJailValidator}>
                        Confirm
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default UnJailValidator;