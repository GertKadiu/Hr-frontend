import { useEffect, useState } from 'react'
import Card from '@/Components/Card/Card'
import style from './styles/promotion.module.css'
import ChartBar from './components/ChartBar'
import PromotionCard from './components/PromotionCard'
import Rating from './components/Rating'
import { useAuth } from '@/ProtectedRoute/Context/AuthContext'
import AxiosInstance from '@/Helpers/Axios'
import { Button } from '@mui/material'
import DrawerComponent from '@/Components/Drawer/Drawer'
import { Loader } from '@/Components/Loader/Loader.tsx'

type TeamMember = {
    _id: string
    firstName: string
    lastName: string
    position: string
    grade: string
}

export default function Promotion() {
    const { currentUser } = useAuth()
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
    const [openDrawer, setOpenDrawer] = useState(false)
    const [id, setId] = useState<string>('')
    const [name, setName] = useState<string>('')
    const [buttonText, setButtonText] = useState('Look At Team Members')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true)
        if (currentUser) {
            if (currentUser.role === 'hr' || currentUser.role === 'pm') {
                fetchTeamMembers()
            }
            setTimeout(() => {
                setLoading(false)
            }, 500)
            setId(currentUser._id.toString())
            setName(`${currentUser.firstName} ${currentUser.lastName}`)
        }
    }, [currentUser])

    const fetchTeamMembers = async () => {
        try {
            if (currentUser && currentUser._id) {
                const response = await AxiosInstance.get(
                    `/project/pm/${currentUser._id}`,
                )
                setTeamMembers(response.data)
            }
        } catch (error) {
            console.error('Error fetching team members:', error)
        }
    }

    const handleClickButton = () => {
        if (buttonText === 'Go Back') {
            if (currentUser) {
                setId(currentUser._id.toString())
                setName(`${currentUser.firstName} ${currentUser.lastName}`)
            }
            setButtonText('Look At Team Members')
            return
        }
        setOpenDrawer(true)
    }

    const handleDrawerClose = () => {
        setOpenDrawer(false)
    }

    const handelTeamMemberClick = (memberId: string) => {
        setId(memberId)
        const member = teamMembers.find((member) => member._id === memberId)
        if (member) {
            setName(`${member.firstName} ${member.lastName}`)
        }
        setOpenDrawer(false)
        setButtonText('Go Back')
    }

    if (!currentUser) {
        return <div>Loading...</div>
    }

    return (
        <>
            {loading && <Loader />}
            {!loading && (
                <div className={style.container}>
                    <DrawerComponent
                        open={openDrawer}
                        onClose={handleDrawerClose}
                    >
                        <h1>Team Members</h1>
                        {teamMembers.map((member) =>
                            member._id !== currentUser._id.toString() ? (
                                <div
                                    key={member._id}
                                    className={style.member}
                                    onClick={() =>
                                        handelTeamMemberClick(member._id)
                                    }
                                >
                                    <p style={{ fontWeight: '700' }}>
                                        {member.firstName} {member.lastName}
                                    </p>
                                    <p>{member.grade}</p>
                                    <p>{member.position}</p>
                                </div>
                            ) : null,
                        )}
                    </DrawerComponent>
                    <div className={style.firstDiv}>
                        <Card
                            padding="20px"
                            backgroundColor="rgba(255, 255, 255, 0.7)"
                        >
                            <h3>{name}</h3>
                            <ChartBar id={id} />
                        </Card>
                        <Rating id={id} />
                    </div>
                    <div className={style.thirdDiv}>
                        {(currentUser.role === 'hr' ||
                            currentUser.role === 'pm') && (
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleClickButton}
                            >
                                {buttonText}
                            </Button>
                        )}
                        <PromotionCard id={id} />
                    </div>
                </div>
            )}
        </>
    )
}
