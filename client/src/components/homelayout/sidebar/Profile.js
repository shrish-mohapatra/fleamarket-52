import React, { useContext, useEffect } from 'react';
import { Avatar, Skeleton } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { CoreContext } from '../../../store/providers/CoreProvider';

function Profile() {
    const { user, getUser } = useContext(CoreContext);

    useEffect(() => {
        if(!user) {
            getUser();
        }
    }, [])

    const renderInfo = () => {
        if(user) return (
            <div className="profile-info">
                <p className="info-name">{user.email}</p>
                <p className="info-balance">${user.accounts[0].balance}</p>
            </div>
        )
    }

    return (        
        <div className="profile">
            <Skeleton loading={!user} active>
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