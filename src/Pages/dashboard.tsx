import React from 'react';
import SideBar from '../../src/Components/sidebar.tsx'
import Header from '../Components/header.tsx';
import Card from './Dashboard/components/card.tsx';
import InfoSection from './Dashboard/components/infoSection.tsx';
import style from '../../src/Pages/Dashboard/style/dashboard.module.css';
import PieChartComponent from './Dashboard/components/piechart.tsx';
import Calendar from './Dashboard/components/calendar.tsx';
import Cardi from '../Components/Card/Card.tsx';

const Dashboard:React.FC =()=> {
   const data = [
    { name: 'Present', value: 20 },
    { name: 'Absent', value: 10 },
    { name: 'On Leave', value: 5 },
    { name: 'Remote', value: 15 },
  ];
    return (
      <>
        <div className={style.dashboard}>
          <Header />
          <div className={style.layout}>
            <SideBar />
            <div className={style.content}>
              <h4>Hi, Elisabeta! Here is what is happening with your team today</h4>
              <div className={style.cardContainer}>
                <Card title='Present' content='20' icon='Present' />
                <Card title='Absent' content='8' icon='Absent'/>
                <Card title='On Leave' content='5'icon='On Leave'  />
                <Card title='Remote' content='3'  icon ='Remote'/>
             
            
            </div>
          </div>

          <Cardi>
          <InfoSection />
        </Cardi>
         <Cardi>          
          <h2>Employee Status</h2>
          <PieChartComponent data={data} />
          </Cardi>
          <Cardi>
          <div className={style.cardContainer}>
        <div className={style.cardGreen}>
        <Card title='Present' content='20' icon='Present' />
        </div>
        <div className={style.cardBlue}>
        
        <Card title='Absent' content='8' icon='Absent' />
        </div>
        <div className={style.cardYellow}>

        <Card title='On Leave' content='5' icon='On Leave' />
        </div>
        <div className={style.cardPurple}>

        <Card title='Remote' content='3' icon='Remote' />
      </div>
      </div>
      </Cardi>
      <Cardi> 
          <div className={style.calendar}> 
            <h2>Calendar</h2>
            <Calendar/>  
          </div>
          </Cardi>
        </div>
        
      
        
           </div>
</>
  );
};

export default Dashboard;