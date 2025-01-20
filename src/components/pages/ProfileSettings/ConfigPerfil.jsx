import React from 'react'
import './ConfigPerfil.css';
import Sidebar2 from '../../../assets/Management/Sidebar/SidebarManagement';
import ProfileAvatar from '../../../assets/camerausericon.png'

const ConfigPerfil = () => {
  return (
        <div className="profile-container">
          <div className="profile-content">
          <div style={{ display: "flex" }}> 
        <Sidebar2 />
      </div>
            <main className="profile-main">
              <section className="profile-info">
                <div className="profile-card">
                    
                  <img
                    src={ProfileAvatar}
                    alt="User"
                    className="profile-avatar"
                    
                  />

                  <div className="profile-details">
                    <h2>Alexa Rawles</h2>
                    <p>alexarawles@gmail.com</p>
                  </div>
                </div>
                <form className="profile-form">
  <div className="profile-form-group">
    <label>Nome completo</label>
    <input type="text" placeholder="Your Full Name" />
  </div>
  <div className="profile-form-group">
    <label>Nick Name</label>
    <input type="text" placeholder="Your Nick Name" />
  </div>
  <div className="profile-form-group">
    <label>Gender</label>
    <select>
      <option>Your Gender</option>
    </select>
  </div>
  <div className="profile-form-group">
    <label>Country</label>
    <input type="text" placeholder="Your Country" />
  </div>
  <div className="profile-form-group">
    <label>Language</label>
    <select>
      <option>Your Language</option>
    </select>
  </div>
  <div className="profile-form-group">
    <label>Time Zone</label>
    <input type="text" placeholder="Your Time Zone" />
  </div>
</form>
                <section className="profile-email-section">
                  <h3>My email Address</h3>
                  <p>
                    <span className="profile-email-address">alexarawles@gmail.com</span>
                    <span className="profile-email-age">1 month ago</span>
                  </p>
                  <button className="profile-add-email-button">+Add Email Address</button>
                </section>
              </section>
            </main>
          </div>
        </div>
      );
    };


export default ConfigPerfil
