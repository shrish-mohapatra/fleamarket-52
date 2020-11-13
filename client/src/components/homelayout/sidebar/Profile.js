import React, { useContext } from 'react';
import { Avatar, Skeleton } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { CoreContext } from '../../../store/providers/CoreProvider';

function Profile() {
    const { user } = useContext(CoreContext);

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

    return (        
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
    );
}

export default Profile;