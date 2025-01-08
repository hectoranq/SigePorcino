/* eslint-disable @typescript-eslint/no-unsafe-function-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { ReactNode } from "react";
//import { theme } from "../../assets/theme";
//import { FillInsteadOfStroke } from "../../utils/constants";

export type Type = "h" | "s" | "p" | "m";
export type Size = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

interface Props {
    type: `${Type}${Size}`;
    children: ReactNode;
    Icon?: any;
    color?: string;
    styles?: React.CSSProperties;
    textStyles?: React.CSSProperties;
    iconStyles?: React.CSSProperties;
    onClick?: Function;
}

const Typography = (props: Props) => {
    const {
        type,
        children,
        textStyles,
        Icon,
        iconStyles,
        styles,
        color,
        onClick,
    } = props;
    // console.log("Icon: ", IconMap.Dropdown);
    const currentColor = color//color ? color : `${theme.palette.black}`;
    const fontSizes: any = {
        1: "56px",
        2: "48px",
        3: "40px",
        4: "32px",
        5: "24px",
        6: "20px",
        7: "18px",
        8: "16px",
        9: "14px",
        0: "12px",
    };
    const fontWeights: any = {
        h: 700,
        s: 600,
        p: 400,
        m: 500,
    };

    const style: React.CSSProperties = {
        fontSize: fontSizes[type[1]],
        fontWeight: fontWeights[type[0]],
        //...theme.marginVertical(0),
        ...textStyles,
        fontFamily: "Inter, sans-serif",
        color: currentColor,
    };
    const GetText = () => {
        switch (type[1]) {
            case "1":
                return <h1 style={style}>{children}</h1>;
            case "2":
                return <h2 style={style}>{children}</h2>;
            case "3":
                return <h3 style={style}>{children}</h3>;
            case "4":
                return <h4 style={style}>{children}</h4>;
            case "5":
                return <h5 style={style}>{children}</h5>;
            case "6":
                return <h6 style={style}>{children}</h6>;
            case "7":
                return <h6 style={style}>{children}</h6>;
            case "8":
                return <h6 style={style}>{children}</h6>;
            case "9":
                return <p style={style}>{children}</p>;
            default:
                return <p style={style}>{children}</p>;
        }
    };
    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                cursor: onClick ? "pointer" : "auto",
                ...styles,
            }}
            onClick={onClick && (() => onClick())}
        >
            {Icon && (
                <Icon
                    style={{
                        height: fontSizes[type[1]],
                        marginRight: "5px",
                        ...iconStyles,
                    }}
                    stroke={currentColor
                        /* FillInsteadOfStroke.includes(Icon?.render?.name)
                           ? "none"
                           : currentColor*/
                    }
                    fill={currentColor
                        /* FillInsteadOfStroke.includes(Icon?.render?.name)
                           ? currentColor
                           : "none"*/
                    }
                />
            )}
            <GetText />
        </div>
    );
};

export default Typography;