import json
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

def handler(event: dict, context) -> dict:
    '''Отправка email-уведомлений клиентам о статусе заказа'''
    
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    try:
        body = json.loads(event.get('body', '{}'))
        
        to_email = body.get('to_email')
        order_id = body.get('order_id')
        status = body.get('status')
        order_total = body.get('order_total')
        
        if not all([to_email, order_id, status]):
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Не все обязательные поля заполнены'})
            }
        
        status_messages = {
            'Новый': 'принят и находится в обработке',
            'В обработке': 'обрабатывается нашими менеджерами',
            'В пути': 'передан в доставку и уже в пути к вам',
            'Доставлен': 'успешно доставлен',
            'Отменен': 'отменен'
        }
        
        status_text = status_messages.get(status, 'обновлен')
        
        subject = f'Обновление статуса заказа {order_id} - CUSTOM SOUND'
        
        html_body = f'''
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background: linear-gradient(135deg, #34d399 0%, #10b981 100%); 
                           color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }}
                .content {{ background: #f9fafb; padding: 30px; }}
                .order-info {{ background: white; padding: 20px; border-radius: 8px; margin: 20px 0; 
                               border-left: 4px solid #10b981; }}
                .status {{ display: inline-block; padding: 8px 16px; background: #d1fae5; 
                          color: #065f46; border-radius: 20px; font-weight: bold; }}
                .footer {{ text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }}
                .contact {{ background: white; padding: 15px; border-radius: 8px; margin-top: 20px; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1 style="margin: 0; font-size: 28px;">CUSTOM SOUND</h1>
                    <p style="margin: 10px 0 0 0; opacity: 0.9;">Профессиональное автомобильное аудио</p>
                </div>
                
                <div class="content">
                    <h2 style="color: #111827; margin-top: 0;">Здравствуйте!</h2>
                    
                    <p>Статус вашего заказа изменен.</p>
                    
                    <div class="order-info">
                        <p style="margin: 0 0 10px 0;"><strong>Заказ:</strong> {order_id}</p>
                        <p style="margin: 0 0 10px 0;"><strong>Новый статус:</strong> 
                           <span class="status">{status}</span>
                        </p>
                        {f'<p style="margin: 0;"><strong>Сумма:</strong> {order_total:,} ₽</p>' if order_total else ''}
                    </div>
                    
                    <p>Ваш заказ <strong>{status_text}</strong>.</p>
                    
                    {'<p style="color: #059669; font-weight: bold;">Благодарим вас за покупку! Надеемся, вам понравятся наши товары.</p>' if status == 'Доставлен' else ''}
                    
                    <div class="contact">
                        <p style="margin: 0 0 10px 0; font-weight: bold;">Контакты для связи:</p>
                        <p style="margin: 5px 0;">📞 +7 (999) 123-45-67</p>
                        <p style="margin: 5px 0;">✉️ info@customsound.ru</p>
                        <p style="margin: 5px 0;">📍 Москва, ул. Примерная, 1</p>
                    </div>
                </div>
                
                <div class="footer">
                    <p>Это автоматическое уведомление. Пожалуйста, не отвечайте на это письмо.</p>
                    <p style="margin-top: 10px;">© 2024 CUSTOM SOUND. Все права защищены.</p>
                </div>
            </div>
        </body>
        </html>
        '''
        
        smtp_host = os.environ.get('SMTP_HOST')
        smtp_port = int(os.environ.get('SMTP_PORT', '587'))
        smtp_user = os.environ.get('SMTP_USER')
        smtp_password = os.environ.get('SMTP_PASSWORD')
        from_email = os.environ.get('FROM_EMAIL', smtp_user)
        
        if not all([smtp_host, smtp_user, smtp_password]):
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'success': True,
                    'message': f'Email отправлен (демо-режим): {to_email}',
                    'demo': True,
                    'details': {
                        'to': to_email,
                        'subject': subject,
                        'order_id': order_id,
                        'status': status
                    }
                })
            }
        
        msg = MIMEMultipart('alternative')
        msg['Subject'] = subject
        msg['From'] = from_email
        msg['To'] = to_email
        
        html_part = MIMEText(html_body, 'html', 'utf-8')
        msg.attach(html_part)
        
        with smtplib.SMTP(smtp_host, smtp_port) as server:
            server.starttls()
            server.login(smtp_user, smtp_password)
            server.send_message(msg)
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'success': True,
                'message': f'Email успешно отправлен на {to_email}'
            })
        }
    
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'error': 'Ошибка отправки email',
                'details': str(e)
            })
        }
