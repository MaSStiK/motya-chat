import clsx from "clsx"

import "./MessageList.css"

const messages = [
  { text: "Стандартное приветствие", fromMe: false },
  { text: "Стандартный ответ", fromMe: true },
  { text: "Стандартный вопрос", fromMe: false },
  { text: "Стандартный ответ", fromMe: true },
  { text: "Нестандартный вопрос", fromMe: false },
  { text: "А вообще это был странный вопрос", fromMe: false },
  { text: "Нестандартный ответ", fromMe: true },
  { text: "Нестандартная шутка", fromMe: false },
  { text: "Ладно, это было не смешно", fromMe: false },
  { text: "Нестандартная реакция 😄", fromMe: true },
  { text: "Нестандартное сообщение", fromMe: true },
  { text: "Стандартное завершение", fromMe: false },
  { text: "Стандартный ответ", fromMe: true }
]

export default function MessageList() {
    return (
        <div className="flex-col gap-3 message-list">
            {messages.map((message, i) => (
                <Message message={message} key={i} />
            ))}
        </div>
    )
}

function Message({ message }) {
    // Добавляем стиль-модификатор перед передаваемыми классами
    const classes = clsx(
        "message",
        {
            "message--from-me": message.fromMe
        }
    )

    return (
        <div className={classes}>
            <span>{message.text}</span>
        </div>
    )
}