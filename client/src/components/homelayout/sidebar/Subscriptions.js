import React, { useContext, useEffect, useState } from 'react';
import { Modal, Table, Switch, InputNumber, Button } from 'antd';

import { DeleteOutlined } from '@ant-design/icons';

import { CoreContext } from '../../../store/providers/CoreProvider';

const { Column } = Table;

function Subscriptions({onClose, visible}) {
    const { user, deleteSubscription, updateSubscription } = useContext(CoreContext);
    const [subs, setSubs] = useState([]);
    const [curRows, setRows] = useState([]);
    const [tableData, setTableData] = useState([]);

    useEffect(() => {
        if(user.data && visible) {
            let subs = []
            user.data.user.subscriptions.map((sub, index) => subs.push({
                ...sub,
                key: index
            }));
            setSubs(subs);
        }
    }, [visible])

    const rowSelection = {
        selectedRowKeys: curRows,
        onChange: (selectedRowKeys, selection) => {
            setRows(selectedRowKeys)
            setTableData(selection)
        },
        getCheckboxProps: record => ({id: record.id, ticker: record.ticker}),
    }

    const onOk = () => {
        for(let i=0; i<tableData.length; i++) {
            if(tableData[i].delete) {
                deleteSubscription({subscriptionID: tableData[i].id}, tableData[i].stock.ticker)
                continue;
            }

            updateSubscription({
                subscriptionID: tableData[i].id,
                rule: tableData[i].rule,
                active: tableData[i].active
            }, tableData[i].stock.ticker)
        }

        setRows([]);
        onClose()
    }

    const onCancel = () => {
        setRows([]);
        onClose()
    }

    const updateRow = (field, value, id) => {
        let temp = [...tableData];
        for(let i=0; i<temp.length; i++) {
            if(temp[i].id == id) {
                temp[i][field] = value;
                return;
            }
        }
    }

    const deleteFlag = (id) => {
        let temp = [...tableData];
        for(let i=0; i<temp.length; i++) {
            if(temp[i].id == id) {
                return temp[i].delete;
            }
        }

        return false;
    }

    const renderSubs = () => {
        if(!user.data) return;
        
        return (
            <>
                <Table dataSource={subs} pagination={false} rowSelection={{...rowSelection}}>
                    <Column
                        title="Ticker"
                        dataIndex="stock"
                        key="ticker"
                        render={stock => stock.ticker}
                    />
                    <Column
                        title="Rule"
                        dataIndex="rule"
                        key="rule"
                        render={(rule, data, index) => {
                            if(curRows.includes(index)) return (
                                <InputNumber 
                                    defaultValue={rule}
                                    min={0}
                                    formatter={value => `${value}%`}
                                    parser={value => value.replace('%', '')}
                                    onChange={(value) => updateRow('rule', value, data.id)}
                                />
                            )
                            return `${rule}%`
                        }}
                    />
                    <Column
                        title="Active"
                        dataIndex="active"
                        key="active"
                        render={(active, data) => <Switch defaultChecked={active} onChange={(value) => updateRow('active', value, data.id)}/>}
                    />
                    <Column 
                        key="delete"
                        render={(text, data) => (
                            <Button
                                shape="circle"
                                size="small"
                                icon={<DeleteOutlined/>}
                                onClick={() => updateRow('delete', true, data.id)}
                                loading={deleteFlag(data.id)}
                            />
                        )}
                    />
                </Table>
                <br/>
            </>
        )
    }

    return (
        <Modal
            title="Event Subscriptions"
            placement="right"
            onOk={onOk}
            onCancel={onCancel}
            visible={visible}
        >
            {renderSubs()}
        </Modal>
    );
}

export default Subscriptions;