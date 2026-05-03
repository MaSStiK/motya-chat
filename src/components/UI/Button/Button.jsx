import Image from "next/image"
import Link from "next/link"
import clsx from "clsx"
import { Loader2 } from "lucide-react"

import "./Button.css"

// Пример использования
/* <Button
    className=""
    text="text"
    title="title"
    icon={Icon}
    alt="button-test"
/> */

// Кнопка с картинкой, но так же есть возможность отобразить текст после картинки
export default function Button({
    id, className="", style,
    text, // Текст кнопки
    title, // Заголовок при наведении

    // Пропсы только для кнопки
    onClick, // Функция при клике
    type="button", // Роль кнопки: button, submit и тд.
    disabled,

    // Пропсы только для ссылки
    href, target, rel, 

    // Пропсы для отображения картинки
    icon, alt="button-image", color="#FFFFFF",
    
    // Модификаторы
    big,
    width100,
    atStart,
    phoneTextHide,
    loading
}) {
    // Добавляем стиль-модификатор перед передаваемыми классами
    const classes = clsx(
        "button ui-button",
        {
            "button--big": big, // Большая кнопка 50px
            "button--width100": width100, // Растяжение на всю ширину
            "button--atStart": atStart, // Позиционированные контента слева
            "button--phoneTextHide": phoneTextHide, // Скрывающийся на телефоне текст
            "button--loading": loading // Анимация загрузки
        },
        className
    )

    const commonProps = { id, className: classes, style, title }

    const Icon = loading ? Loader2  // Если loading - картинка загрузки
        : (typeof icon === "object" ? icon : null) // Если в icon передаем иконку из "lucide-react" - отображаем его как компонент
    const src = typeof icon === "string" ? icon : null // Если в icon передаем ссылку на картинку - отображаем как Image src
    const content = (
        <>
            {Icon && (
                <Icon
                    size={20}
                    color={color}
                    className={loading ? "spin" : ""}
                />
            )}
            {src && <Image src={src} alt={alt} width={20} height={20} />}
            {text && <span>{text}</span>}
        </>
    )


    // Если прокинута ссылка - то возвращаем ссылку с классом кнопки
    if (href) {
        // Если ссылка внешняя - возвращаем просто тег a
        if (href.startsWith("http")) {
            return (
                <a {...commonProps}
                    aria-disabled={disabled}
                    href={href}
                    target={target || "_blank"}
                    rel={rel || "noopener noreferrer"}
                >
                    {content}
                </a>
            )
        }

        // Если внутренняя ссылка
        return (
            <Link {...commonProps}
                aria-disabled={disabled}
                href={href}
            >
                {content}
            </Link>
        )
    }

    // Если обычная кнопка
    return (
        <button {...commonProps}
            type={type}
            onClick={onClick} 
            disabled={disabled || loading}
        >
            {content}
        </button>
    )
}