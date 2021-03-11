import React, { useEffect, useState } from 'react';
import { Button } from 'rsuite';
import { useViewport } from '../../context/ViewportContext';
import { useHistory, useParams } from 'react-router-dom';
import { getContractEvents } from '../../service/kai-explorer';
import './logs.css'
import { renderHashToRedirect } from '../../common/utils/string';

function Logs() {
    const { txHash }: any = useParams();
    let history = useHistory();
    const { isMobile } = useViewport();
    const [loading, setLoading] = useState(false);

    const [logs, setLogs] = useState({} as any);
    const [data, setData] = useState();

    useEffect(() => {
        (async () => {
            setLoading(true);
            const data = await getContractEvents(1, 10, txHash);
            setLogs(data);
            setData(data.data);
            setLoading(false);
        })()
    }, [])

    const dec = () => {
        const newData = parseInt(logs.data as any, 16);
        const formatData = newData.toLocaleString('fullwide', { useGrouping: false });
        setData(formatData as any);
    }

    const hex = () => {
        setData(logs.data);
    }

    return (
        Object.keys(logs).length > 0 ? <div>
            <div className="body">
                <div className="row">
                    <p className="property-title">Address</p>
                    <span className="property-content">
                        {renderHashToRedirect({
                            hash: logs.address,
                            headCount: 50,
                            tailCount: 4,
                            showTooltip: false,
                            redirectTo: `/address/${logs.address}`,
                            showCopy: true
                        })}
                    </span>
                </div>

                <div className="row">
                    <p className="property-title">Name</p>
                    <span className="property-content">{logs.methodName} ({logs.argumentsName})</span>
                </div>

                <div className="row">
                    <p className="property-title">Topics</p>
                    <ul className="topics">
                        {logs.topics.map((it: any, index: any) => {
                            return (
                                <li key={index}>
                                    <span className="num">{index + 1}</span> <span className="property-content">{it}</span>
                                </li>
                            )
                        })}
                    </ul>
                </div>

                <div className="row borderNone">
                    <p className="property-title">Data</p>
                    <div className="right">
                        <span className="property-content">{data}</span>
                        <div style={{ display: 'flex', marginTop: '8px' }}>
                            <Button style={{ width: '50px', marginRight: '8px' }} onClick={() => dec()}>Dec</Button>
                            <Button style={{ width: '50px' }} onClick={() => hex()}>Hex</Button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
            : <div>
                <p className="property-content">No data found</p>
            </div>
    )
}

export default Logs
