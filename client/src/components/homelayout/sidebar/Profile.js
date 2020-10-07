import React from 'react';
import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';

function Profile() {
    return (
        <div className="profile">
            <Avatar
                className="profile-avatar"
                size={48}
                shape="square"
                icon={<UserOutlined/>}
            />
            <div className="profile-info">
                <p className="info-name">John Doe</p>
                <p className="info-balance">$12,879</p>
            </div>
        </div>
    );
}

export default Profile;