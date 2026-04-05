import Image from "next/image"
import Link from "next/link"
import clsx from "clsx"

import "./Input.css"

// Пример использования
/* <Button
    src="/assets/image.png"
    alt="button-test"
    className=""
    text="text"
    title="title"
/> */

// Кнопка с картинкой, но так же есть возможность отобразить текст после картинки
export default function Input({
    id, className="", style,
    placeholder, // Заголовок при наведении
    type="text",

    onInput, onChange,

    // Пропсы для отображения картинки
    icon, alt="button-image", color="#FFFFFF",
    
    // Модификаторы
    small,
    round,
    disabled,
}) {
    // Добавляем стиль-модификатор перед передаваемыми классами
    const classes = clsx(
        "ui-input",
        {
            "input--small": small, // Маленький инпут
            "input--round": round, // Скругленные углы
        },
        className
    );

    const commonProps = { id, className: classes, style }

    const Icon = typeof icon === "object" ? icon : null // Если в icon передаем иконку из "lucide-react" - отображаем его как компонент
    const src = typeof icon === "string" ? icon : null // Если в icon передаем ссылку на картинку - отображаем как Image src
    const content = (
        <div className="input-image">
            {Icon && <Icon size={20} color={color} />}
            {src && <Image src={src} alt={alt} width={20} height={20} />}
        </div>
    )    

    if (type === "text") {
        return (
            <div {...commonProps}>
                {content}
                <input 
                    type="text"
                    placeholder={placeholder}
                    onInput={onInput}
                    onChange={onChange}
                    disabled={disabled}
                />
            </div>
        )
    }

    return (
        <span>Доступен только Input text</span>
    )
}