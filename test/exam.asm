SECTION BOOT ALIGN=16 VSTART=0x7c00
        jmp start

message db 'hello, world!'

start:
        mov ax, cs
        mov ds, ax
        mov ax,0xb800
        mov es,ax

        ; 循环把message到屏幕上
        mov cx, start - message
        mov bx, message
        mov si, 0
        mov di, 0
write:
        mov al, [bx+si]
        mov ah, 0x07
        mov [es:di], ax
        inc si
        add di, 2

        loop write

        jmp $

times 510 - ($ - $$) db 0

db 0x55, 0xAA
