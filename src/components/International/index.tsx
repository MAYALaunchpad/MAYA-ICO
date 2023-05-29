import { useState } from "react";
import type { MenuProps } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { Button, Dropdown, Space } from "antd";
import puse from "../../assets/image/zhuang.png";
import "./index.scss";

const International = () => {
  const [handelvoice, setHandelvoice] = useState("Ethereum");
  const Meslei = [
    {
      label: "Ethereum",
      key: "1",
    },
    {
      label: "BNB",
      key: "2",
    },
  ];
  const handleMenuClick: MenuProps["onClick"] = (e) => {
    setHandelvoice(Meslei[Number(e.key) - 1].label);
    if (e.key == "1") {
    } else {
    }
  };
  const items: MenuProps["items"] = [
    {
      key: "1",
      danger: true,
      label: "Ethereum",
    },
    {
      key: "2",
      label: "BNB",
    },
  ];

  return (
    <div className="spiineosr">
      {/* <div className="sapeien">
        <Dropdown
          menu={{ items, onClick: handleMenuClick }}
          placement="bottom"
          arrow={{ pointAtCenter: true }}
        >
          <Button>
            <Space>
              <div className="speriise">
                <img src={puse} alt="" />
                <div className="psoduenxc">
                  {handelvoice} <DownOutlined style={{ fontSize: "15px" }} />
                </div>
              </div>
            </Space>
          </Button>
        </Dropdown>
      </div> */}
    </div>
  );
};

export default International;
