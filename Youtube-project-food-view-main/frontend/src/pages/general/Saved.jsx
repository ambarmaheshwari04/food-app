import React, { useContext } from 'react'
import ReelFeed from '../../components/ReelFeed'
import { AppContext } from '../../routes/AppRoutes'

const Saved = () => {
    const { savedReels } = useContext(AppContext)

    return (
        <ReelFeed
            items={savedReels}
            emptyMessage="No saved videos in this session yet."
            isSavedPage={true}
        />
    )
}

export default Saved;