import React, { useContext, useEffect, useRef, useState } from 'react';
import moment from 'moment';

import { Avatar, Skeleton, DatePicker } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { CoreContext } from '../../../store/providers/CoreProvider';

function Profile() {
    const { user, dayOffset, editDayOffset } = useContext(CoreContext);
    const [curDate, setCurDate] = useState(null);
    const datePicker = useRef();

    useEffect(() => {
        if(dayOffset.data && !curDate) {
            setCurDate(moment().add(dayOffset.data.getDayOffset, "days"))
        }
    }, [dayOffset, curDate])

    const renderInfo = () => {
        if(user.data) {
            let data = user.data.user
            return (
                <div className="profile-info">
                    <p className="info-name">{data.email}</p>
                    <p className="info-balance">${(data.accounts[0].balance/100).toFixed(2)}</p>
                </div>
            )
        }
    }

    const onChange = value => {
        // Prevent invalid dates (past dates)
        if(value < curDate.startOf('day')) {
            setCurDate(curDate);
            return;
        }

        let duration = moment.duration(value.diff(curDate))
        editDayOffset(Math.floor(duration.asDays()))
        setCurDate(value);
    }

    return (
        <div>
            <div className="profile">
                <Skeleton loading={user.loading} active avatar>
                    <Avatar
                        className="profile-avatar"
                        size={48}
                        shape="square"
                        icon={<UserOutlined/>}
                    />
                    {renderInfo()}
                </Skeleton>
            </div>

            <div className="date-picker-div">
                <DatePicker
                    ref={datePicker}
                    className="date-picker"
                    value={curDate}
                    allowClear={false}
                    renderExtraFooter={() => "Change server date."}
                    onChange={onChange}
                />
            </div>
        </div>
    );
}

export default Profile;