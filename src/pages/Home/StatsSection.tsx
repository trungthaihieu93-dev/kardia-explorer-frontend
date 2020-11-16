import React, { useEffect, useState } from 'react'
import { Icon, Panel } from 'rsuite';
import { numberFormat } from '../../common/utils/number';
import { calculateTPS, getTotalStats } from '../../service/kai-explorer';
import './stat.css'

const StatsSection = ({ totalTxs = 0, blockHeight = 0, blockList = [] }: { totalTxs: number, blockHeight: number, blockList: KAIBlock[] }) => {
    const [tps, setTps] = useState(0)
    const [totalStats, setTotalStats] = useState({} as TotalStats)

    useEffect(() => {
        const tps = calculateTPS(blockList);
        setTps(tps);
        (async () => {
            const totalStats = await getTotalStats();
            setTotalStats(totalStats)
        })()
    }, [blockList]);

    return (
        <div className="stats-section">
                <Panel className="stat-container" shaded>
                    <div className="stat">
                        <div className="icon">
                            <Icon className="highlight" icon="cubes" size={"lg"} />
                        </div>
                        <div className="title">Block Height</div>
                        <div className="value">{numberFormat(blockHeight)}</div>
                    </div>

                    <div className="stat">
                        <div className="icon">
                            <Icon className="highlight" icon="realtime" size={"lg"} />
                        </div>
                        <div className="title">Live TPS</div>
                        <div className="value">{numberFormat(tps)}</div>
                    </div>

                    <div className="stat">
                        <div className="icon">
                            <Icon className="highlight" icon="exchange" size={"lg"} />
                        </div>
                        <div className="title">Transactions</div>
                        <div className="value">{numberFormat(totalTxs)}</div>
                    </div>

                    <div className="stat">
                        <div className="icon">
                            <Icon className="highlight" icon="peoples" size={"lg"} />
                        </div>
                        <div className="title">Addresses</div>
                        <div className="value">{numberFormat(totalStats.totalHolders)}</div>
                    </div>
                    <div className="stat">
                        <div className="icon">
                            <Icon className="highlight" icon="file-text-o" size={"lg"} />
                        </div>
                        <div className="title">Contracts</div>
                        <div className="value">{numberFormat(totalStats.totalContracts)}</div>
                    </div>
                </Panel>
        </div>
    )
}

export default StatsSection