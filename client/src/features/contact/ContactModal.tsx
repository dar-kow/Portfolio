import { useRef } from "react";
import { motion } from "framer-motion";
import emailjs from "@emailjs/browser";
import { useLanguage } from "../../shared/components/common/LanguageContext";
import { contactFormMessages } from "./data";
import { useToast } from "../../hooks/use-toast";

type ContactModalProps = {
    onClose: () => void;
};

const ContactModal = ({ onClose }: ContactModalProps) => {
    const { lang } = useLanguage();
    const formRef = useRef<HTMLFormElement>(null);
    const { toast } = useToast();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!formRef.current) return;
        try {
            const result = await emailjs.sendForm(
                "service_w8l9rnw",
                "template_t7iwget",
                formRef.current,
                "9ng9bxiFxo29I07gV"
            );
            toast({
                title: lang === "pl" ? "Wiadomość wysłana" : "Message Sent",
                description: lang === "pl"
                    ? "Twoja wiadomość została wysłana pomyślnie."
                    : "Your message was sent successfully."
            });
            onClose();
        } catch (error) {
            console.error("Błąd przy wysyłaniu wiadomości:", error);
            toast({
                title: lang === "pl" ? "Błąd" : "Error",
                description: lang === "pl"
                    ? "Wystąpił błąd przy wysyłaniu wiadomości."
                    : "An error occurred while sending your message."
            });
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="contact-modal"
        >
            {/* Overlay */}
            <div className="contact-modal-overlay" onClick={onClose} />
            {/* Modal Content */}
            <motion.div
                className="contact-modal-content"
                initial={{ y: -50 }}
                animate={{ y: 0 }}
            >
                <h2 className="contact-modal-header">
                    {contactFormMessages.header[lang]}
                </h2>
                <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        name="name"
                        placeholder={contactFormMessages.namePlaceholder[lang]}
                        required
                        className="w-full p-2 rounded border border-[var(--matrix-dark)] bg-[var(--matrix-bg)] text-[var(--matrix-light)]"
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder={contactFormMessages.emailPlaceholder[lang]}
                        required
                        className="w-full p-2 rounded border border-[var(--matrix-dark)] bg-[var(--matrix-bg)] text-[var(--matrix-light)]"
                    />
                    <textarea
                        name="message"
                        placeholder={contactFormMessages.messagePlaceholder[lang]}
                        required
                        className="w-full p-2 rounded border border-[var(--matrix-dark)] bg-[var(--matrix-bg)] text-[var(--matrix-light)] max-h-[20vh] overflow-y-auto"
                    ></textarea>
                    <button
                        type="submit"
                        className="w-full py-2 rounded bg-[var(--matrix-primary)] text-black hover:bg-[var(--matrix-dark)] transition"
                    >
                        {contactFormMessages.submitButton[lang]}
                    </button>
                </form>
            </motion.div>
        </motion.div>
    );
};

export default ContactModal;