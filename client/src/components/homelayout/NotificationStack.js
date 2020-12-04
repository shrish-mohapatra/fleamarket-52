import React, { useContext, useState, useEffect } from 'react';
import { notification } from 'antd'
import { CoreContext } from '../../store/providers/CoreProvider';

function NotificationStack() {
    const { user, deleteNotification } = useContext(CoreContext);
    const [notifs, setNotifs] = useState({});

    useEffect(() => {
        if(user.data) {
            let newNotifs = [...user.data.user.notifications]
            if(newNotifs.length === 0) return;

            let modNotifs = {...notifs}

            for(let i=0; i<newNotifs.length; i++) {
                if(modNotifs[newNotifs[i].id]) continue;
                modNotifs[newNotifs[i].id] = true;

                notification[newNotifs[i].tag]({
                    message: newNotifs[i].title,
                    description: newNotifs[i].message,
                })

                deleteNotification({notificationID: newNotifs[i].id})
            }

            setNotifs(modNotifs)
        }
    }, [user])

    return (<></>);
}

export default NotificationStack;