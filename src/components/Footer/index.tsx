import React from "react";
import './index.scss'
import Logo from '../../assets/image/ico6.png'
import TwitterLogo from '../../assets/image/ico7.png'
import TelegramLogo from '../../assets/image/ico8.png'
import YoutubeLogo from '../../assets/image/ico9.png'


export default function Footer(){

    return (
        <div className="Footer">
            <div className="FooterWrapper">
                <div className="FooterWrapper_left">
                    <div className="FooterWrapperLeft_top">
                        <img src={Logo} alt="" />
                        <div className="FooterWrapperContract">
                            <img src={TwitterLogo} alt="" />
                            <img src={TelegramLogo} alt="" />
                            <img src={YoutubeLogo} alt="" />
                        </div>
                    </div>
                    <span className="copyright">Copyright ©2023 maya, All rights reserved.</span>
                </div>
                <div className="FooterWrapper_right">
                    <div className="FooterWrapperRight_top">
                        <div className="bottomSubtitle">
                            <span className="bottomSubtitle_item">About</span>
                            <span className="bottomSubtitle_item">Contact us</span>
                            <span className="bottomSubtitle_item">Terms Of Service</span>
                            <span className="bottomSubtitle_item">Privacy</span>
                        </div>
                        <div className="bottomSubtitle">
                            <span className="bottomSubtitle_item">Pricing</span>
                            <span className="bottomSubtitle_item">Creator report 2023</span>
                            <span className="bottomSubtitle_item">Carousel Maker</span>
                        </div>
                    </div>
                    <div className="FooterWrapperRight_bottom">
                        <img src={TwitterLogo} alt="" />
                        <img src={TelegramLogo} alt="" />
                        <img src={YoutubeLogo} alt="" />
                    </div>
                </div>
            </div>
        </div>
    )
}