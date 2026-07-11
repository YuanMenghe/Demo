import React from 'react';
import { CheckCircle2, AlertCircle, Clock, ChevronRight, UploadCloud, FileCheck, ShieldCheck } from 'lucide-react';
import { CertItem } from '../types';

const certData: CertItem[] = [
  {
    id: 'c1',
    name: '实名认证',
    description: '姓名、身份证件、手机号及本人活体核验',
    status: '已认证',
    level: null,
    requirements: ['身份证正反面', '人脸识别', '同名银行卡绑定'],
  },
  {
    id: 'c2',
    name: '医学背景认证',
    description: '医学学历、在读证明、工作证明或相关专业资格材料',
    status: '已认证',
    level: 'S1',
    requirements: ['学历证书/学生证', '工作证明'],
  },
  {
    id: 'c3',
    name: '执业医师认证',
    description: '核对姓名、执业机构、执业类别、执业范围和注册状态',
    status: '已认证',
    level: null,
    requirements: ['医师资格证书', '医师执业证书'],
  },
  {
    id: 'c4',
    name: '职称认证',
    description: '专业技术资格证书、医院聘任文件或人事证明，并结合医院官网方式核验',
    status: '已认证',
    level: 'S3',
    requirements: ['副主任医师资格证书', '聘任文件'],
  },
  {
    id: 'c5',
    name: 'S5高级专家认证',
    description: '人工核验专业方向、任职经历、科研成果及稀缺项目经验',
    status: '待补充',
    level: 'S5',
    requirements: ['公开学术履历', '核心期刊发表记录', '特定领域项目经验证明'],
  },
];

export default function Certification() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white p-6 rounded-xl border border-slate-200">
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-200">
          <div className="w-16 h-16 bg-noah-50 text-noah-600 rounded-full flex items-center justify-center">
            <ShieldCheck size={32} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Dr. 张三</h2>
            <div className="flex items-center gap-3 mt-1 text-sm">
              <span className="flex items-center gap-1 text-noah-600 bg-noah-50 px-2 py-0.5 rounded font-medium">
                <CheckCircle2 size={14} /> 当前资质: S3 副主任级
              </span>
              <span className="text-slate-500">最高可承接 C5-S3 级别任务</span>
            </div>
          </div>
        </div>
        
        <p className="text-sm text-slate-500 leading-relaxed mb-6">
          平台对参与医学标注和专家评审的用户进行实名、执业身份和职称分级认证。资质逐级认证，信息应相互一致。
          未通过认证的用户不能展示相应身份标签，也不能承接对应等级的任务。
        </p>

        <div className="space-y-4">
          {certData.map((cert) => (
            <div key={cert.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-slate-100 rounded-xl bg-slate-50/50 hover:bg-slate-50 transition-colors">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-bold text-slate-900">{cert.name}</h3>
                  {cert.level && (
                    <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-mono">
                      解锁 {cert.level}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mb-2">{cert.description}</p>
                <div className="flex flex-wrap gap-2">
                  {cert.requirements.map((req, i) => (
                    <span key={i} className="text-xs text-slate-400 flex items-center gap-1">
                      <FileCheck size={12} /> {req}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="mt-4 sm:mt-0 sm:ml-6 flex items-center shrink-0">
                {cert.status === '已认证' ? (
                  <div className="flex items-center gap-1 text-green-600 bg-green-50 px-3 py-1 rounded text-xs font-medium">
                    <CheckCircle2 size={14} /> 已认证
                  </div>
                ) : cert.status === '待补充' ? (
                  <button className="flex items-center gap-1 text-noah-600 bg-noah-50 hover:bg-noah-100 px-4 py-1.5 rounded-lg text-xs font-medium transition-colors">
                    <UploadCloud size={14} /> 去补充
                  </button>
                ) : (
                  <div className="flex items-center gap-1 text-orange-600 bg-orange-50 px-3 py-1 rounded text-xs font-medium">
                    <Clock size={14} /> {cert.status}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 flex gap-4">
        <AlertCircle className="text-noah-600 shrink-0 mt-0.5" />
        <div className="text-sm text-slate-700">
          <h4 className="font-bold text-slate-900 mb-1">认证规则提示</h4>
          <ul className="list-disc list-inside space-y-1 text-slate-500 text-xs">
            <li>医学背景认证不能替代执业医师认证；执业医师认证不能自动证明当前职称。</li>
            <li>姓名、执业机构、专业方向和职称材料存在明显冲突时，将转人工复核。</li>
            <li>平台记录提交材料、核验方式、审核人员、审核时间和认证有效期。证件信息最小化采集并脱敏展示。</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
