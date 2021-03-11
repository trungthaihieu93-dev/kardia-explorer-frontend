import React from 'react'
import { Col, FlexboxGrid, Table } from 'rsuite';
import TablePagination from 'rsuite/lib/Table/TablePagination';
import { convertValueFollowDecimal } from '../../../common/utils/amount';
import { numberFormat } from '../../../common/utils/number';
import { renderHashToRedirect } from '../../../common/utils/string';
import { TABLE_CONFIG } from '../../../config';
import { ITokenHoldersByToken } from '../../../service/kai-explorer/tokens/type';
const { Column, HeaderCell, Cell } = Table;

const TokenHolder = ({holders, totalHolder, size, setSize, page, setPage, loading}: {
    holders: ITokenHoldersByToken[];
    totalHolder: number;
    size: number;
    setSize: (_size: number) => void;
    page: number;
    setPage: (_page: number) => void;
    loading: boolean
}) => {


    console.log("Holders", holders);
    

    return (
        <FlexboxGrid justify="space-between">
            <FlexboxGrid.Item componentClass={Col} colspan={24} md={24}>
                <Table
                    rowHeight={() => 60}
                    height={200}
                    data={holders}
                    autoHeight
                    hover={false}
                    wordWrap
                    loading={loading}
                >
                    <Column flexGrow={2} minWidth={300} verticalAlign="middle">
                        <HeaderCell>Address</HeaderCell>
                        <Cell>
                            {(rowData: ITokenHoldersByToken) => {
                                return (
                                    <div>
                                       {
                                            renderHashToRedirect({
                                                hash: rowData.holderAddress,
                                                headCount: 20,
                                                tailCount: 4,
                                                showTooltip: false,
                                                redirectTo: `/address/${rowData.holderAddress}`
                                            })
                                       }
                                    </div>
                                );
                            }}
                        </Cell>
                    </Column>
                    <Column flexGrow={1} minWidth={180} verticalAlign="middle">
                        <HeaderCell>Balance</HeaderCell>
                        <Cell>
                            {(rowData: ITokenHoldersByToken) => {
                                return (
                                    <div>
                                        {numberFormat(convertValueFollowDecimal(rowData.balance, rowData.tokenDecimals))}
                                    </div>
                                );
                            }}
                        </Cell>
                    </Column>
                </Table>
                <TablePagination
                    lengthMenu={TABLE_CONFIG.pagination.lengthMenu}
                    activePage={page}
                    displayLength={size}
                    total={totalHolder}
                    onChangePage={setPage}
                    onChangeLength={setSize}
                />
            </FlexboxGrid.Item>
        </FlexboxGrid>
    )
}

export default TokenHolder