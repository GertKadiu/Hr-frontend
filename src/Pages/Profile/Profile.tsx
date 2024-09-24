import * as React from 'react'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'
import Contrat from './Components/Contrat/Contrat'
import ProfileForm from './Components/ProfileForm/ProfileForm'
import ChangePass from './Components/ChangePass/ChangePass'
import { useAuth } from '@/ProtectedRoute/Context/AuthContext'
import { useParams } from 'react-router-dom'

interface TabPanelProps {
    children?: React.ReactNode
    index: number
    value: number
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`vertical-tabpanel-${index}`}
            aria-labelledby={`vertical-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: '25px 50px' }}>{children}</Box>}
        </div>
    )
}

function a11yProps(index: number) {
    return {
        id: `vertical-tab-${index}`,
        'aria-controls': `vertical-tabpanel-${index}`,
    }
}

export default function Profile() {
    const [value, setValue] = React.useState(0)
    const { currentUser } = useAuth()
    const { id } = useParams()

    const currentUserId = currentUser?._id === id
    const hr = currentUser?.role === 'hr'
    const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue)
    }

    return (
        <Box
            sx={{
                flexGrow: 1,
                bgcolor: 'background.paper',
                display: 'flex',
                borderRadius: '15px',
                boxShadow: '0px 3px 9px rgba(0, 0, 0, 0.1)',
            }}
        >
            <Tabs
                orientation="vertical"
                variant="scrollable"
                value={value}
                onChange={handleChange}
                aria-label="Vertical tabs example"
                sx={{
                    borderRight: 1,
                    borderColor: 'divider',
                    display: 'flex',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    '& .MuiTabs-indicator': { right: 'auto', left: 0 },
                    '& .MuiTab-root': {
                        alignContent: 'center',
                        justifyContent: 'center',
                        marginBottom: 5,
                        marginRight: 5,
                        mt: 1.5,
                        fontFamily: 'Outfit, sans-serif',
                        height: '70px',
                        fontWeight: '700',
                        fontSize: '18px',
                        borderRadius: '5px',
                        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
                    },
                }}
            >
                <Tab label="Profile" {...a11yProps(0)} />
                {currentUserId || hr ? (
                    <Tab label="payroll" {...a11yProps(1)} />
                ) : null}
                {currentUserId ? (
                    <Tab label="Change Password" {...a11yProps(2)} />
                ) : null}
            </Tabs>
            <TabPanel value={value} index={0}>
                <ProfileForm />
            </TabPanel>
            <TabPanel value={value} index={1}>
                <Contrat />
            </TabPanel>
            <TabPanel value={value} index={2}>
                <ChangePass />
            </TabPanel>
        </Box>
    )
}
