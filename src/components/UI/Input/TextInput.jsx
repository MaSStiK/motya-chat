import Image from "next/image"
import Link from "next/link"
import clsx from "clsx"

import "./TextInput.css"

// Пример использования
/* <TextInput
    src="/assets/image.png"
    placeholder="text"
    id="text"
    name="title"
    minLength={4}
    maxLength={128}
/> */

// Кнопка с картинкой, но так же есть возможность отобразить текст после картинки
export default function TextInput({
    className="", style,
    type="text",

    // Пропсы для отображения картинки
    icon, alt="button-image", color="#FFFFFF",
    
    // Модификаторы
    big,
    round,
    
    // Все остальное летит в инпут
    // id, name, placeholder, minLength, maxLength, onInput, onChange, required, disabled
    ...rest
}) {
    // Добавляем стиль-модификатор перед передаваемыми классами
    const classes = clsx(
        "ui-text-input",
        {
            "input--big": big, // Маленький инпут
            "input--round": round, // Скругленные углы
        },
        className
    );

    const commonProps = { className: classes, style }

    const Icon = typeof icon === "object" ? icon : null // Если в icon передаем иконку из "lucide-react" - отображаем его как компонент
    const src = typeof icon === "string" ? icon : null // Если в icon передаем ссылку на картинку - отображаем как Image src
    const content = (
        <div className="input-image">
            {Icon && <Icon size={20} color={color} />}
            {src && <Image src={src} alt={alt} width={20} height={20} />}
        </div>
    )    

    return (
        <div {...commonProps}>
            {content}
            <input {...rest}
                type={type}
            />
        </div>
    )
}