import React from 'react';
import { Box, CssBaseline, Drawer, List, ListItem, ListItemText } from '@mui/material';
import Playground from '../components/Playground';
import './HomePage.css';

const HomePage = () => {
    return (
        <Box sx={{ display: 'flex', height: '100vh' }}> {/* 设置高度为100vh */}
            <CssBaseline />
            <Drawer
                className="drawer"
                variant="permanent"
                anchor="left"
                classes={{ paper: 'drawer-paper' }}
            >
                <div className="drawer-content">
                    <List>
                        {['Person', 'ranking', 'record', 'logout'].map((text, index) => (
                            <ListItem button key={text}>
                                <ListItemText primary={text} />
                            </ListItem>
                        ))}
                    </List>
                </div>
            </Drawer>
            <Box
                component="main"
                sx={{ flexGrow: 1, p: 3 }}
                className="main-container" // 添加这个类名以便在CSS中进行调整
            >
                <Playground />
            </Box>
        </Box>
    );
};

export default HomePage;
