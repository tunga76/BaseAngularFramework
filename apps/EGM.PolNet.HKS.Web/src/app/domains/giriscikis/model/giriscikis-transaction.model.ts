export interface GiriscikisTransaction {
    id: string;
    seriNo: string;
    kimlikNo: string;
    ad: string;
    soyad: string;
    ulke: string;
    islemTarihi: Date;
    islemTuru: 'Giris' | 'Cikis';
    cinsiyet: 'E' | 'K';
    dogumTarihi: string;
}
