import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { errorCode, failCode, successCode } from 'src/config/response';

@Injectable()
export class ImageService {
  prisma = new PrismaClient();

  async getImg() {
    const data = await this.prisma.hinh_anh.findMany();
    return data;
  }

  async getImgByName(ten: string) {
    const data = await this.prisma.hinh_anh.findMany({
      where: {
        ten_hinh: {
          startsWith: `%${ten}%`,
        },
      },
    });
    return data;
  }
  // GET thông tin ảnh và người tạo ảnh bằng id ảnh.
  async getImgInforById(imgId: string, res: any) {
    try {
      const data = await this.prisma.hinh_anh.findFirst({
        where: {
          hinh_anh_id: +imgId,
        },
        include: {
          nguoi_dung: true,
        },
      });
      if (data) {
        return successCode(res, data, 'Lay data thanh cong');
      } else {
        return failCode(res, 'Khong co tai nguyen, img not exist');
      }
    } catch (error) {
      return errorCode(error, 'Loi Backend');
    }
  }
  // GET thông tin đã lưu hình này chưa theo id ảnh (dùng để kiểm tra ảnh này đã
  async getImgSaveInforById(imgId: string, userId: string, res: any) {
    try {
      const data = await this.prisma.hinh_anh.findFirst({
        where: {
          hinh_anh_id: +imgId,
        },
        include: {
          nguoi_dung: true,
          luu_anh: {
            where: {
              nguoi_dung_id: +userId,
            },
          },
        },
      });
      if (data) {
        let cloneData = { ...data, isSaved: false };
        if (data.luu_anh.length >= 1) {
          cloneData.isSaved = true;
          return successCode(res, cloneData, 'Lay data thanh cong');
        }
        return successCode(res, cloneData, 'Lay data thanh cong');
      } else {
        return failCode(res, 'Khong co tai nguyen, img not exist');
      }
    } catch (error) {
      return errorCode(error, 'Loi Backend');
    }
  }
}
